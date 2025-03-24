import axios from 'axios';

const LCD_ENDPOINT = 'https://terra-classic-lcd.publicnode.com';
const PROPOSALS_CACHE_KEY = 'terra_proposals_cache';
const PARAMS_CACHE_KEY = 'terra_gov_params_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface GovParams {
  voting_params: {
    voting_period: string;
  };
  deposit_params: {
    min_deposit: Array<{
      denom: string;
      amount: string;
    }>;
    max_deposit_period: string;
  };
  tally_params: {
    quorum: string;
    threshold: string;
    veto_threshold: string;
  };
}

export interface Vote {
  proposal_id: string;
  voter: string;
  option: string;
  options: Array<{
    option: string;
    weight: string;
  }>;
}

export interface Validator {
  operator_address: string;
  consensus_pubkey: {
    '@type': string;
    key: string;
  };
  jailed: boolean;
  status: string;
  tokens: string;
  delegator_shares: string;
  description: {
    moniker: string;
    identity: string;
    website: string;
    security_contact: string;
    details: string;
  };
  unbonding_height: string;
  unbonding_time: string;
  commission: {
    commission_rates: {
      rate: string;
      max_rate: string;
      max_change_rate: string;
    };
    update_time: string;
  };
  min_self_delegation: string;
}

export interface ProposalContent {
  '@type': string;
  title: string;
  description: string;
  amount?: string[];
  recipient?: string;
  changes?: Array<{
    subspace: string;
    key: string;
    value: string;
  }>;
}

export interface Proposal {
  proposal_id: string;
  id: string;
  messages: Array<{
    '@type': string;
    content?: {
      '@type': string;
      title?: string;
      description?: string;
      summary?: string;
      metadata?: string;
      amount?: string[];
      recipient?: string;
      changes?: Array<{
        subspace: string;
        key: string;
        value: string;
      }>;
    };
  }>;
  status: string;
  final_tally_result: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
    total_voting_power?: string;
    quorum_reached?: boolean;
    threshold_reached?: boolean;
    veto_threshold_reached?: boolean;
  };
  submit_time: string;
  deposit_end_time: string;
  total_deposit: Array<{
    denom: string;
    amount: string;
  }>;
  voting_start_time: string;
  voting_end_time: string;
  metadata: string;
  title?: string;
  summary?: string;
  content?: ProposalContent;
  votes?: Vote[];
}

export interface ValidatorWithVotingPower extends Validator {
  voting_power: number;
  voting_percentage: number;
}

const api = axios.create({
  baseURL: LCD_ENDPOINT,
});

const getCachedData = <T>(key: string): T | null => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (error) {
    localStorage.removeItem(key);
    return null;
  }
};

const setCachedData = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify({
    timestamp: Date.now(),
    data
  }));
};

export const fetchGovParams = async (forceRefresh = false): Promise<GovParams> => {
  if (!forceRefresh) {
    const cached = getCachedData<GovParams>(PARAMS_CACHE_KEY);
    if (cached) return cached;
  }

  const [votingParams, depositParams, tallyParams] = await Promise.all([
    api.get('/cosmos/gov/v1beta1/params/voting'),
    api.get('/cosmos/gov/v1beta1/params/deposit'),
    api.get('/cosmos/gov/v1beta1/params/tallying')
  ]);

  const params: GovParams = {
    voting_params: votingParams.data.voting_params,
    deposit_params: depositParams.data.deposit_params,
    tally_params: tallyParams.data.tally_params
  };

  setCachedData(PARAMS_CACHE_KEY, params);
  return params;
};

export const fetchTotalStaked = async (): Promise<number> => {
  const { data } = await api.get('/cosmos/staking/v1beta1/pool');
  return parseInt(data.pool.bonded_tokens);
};

const processProposal = async (proposal: Proposal): Promise<Proposal> => {
  let title = proposal.title;
  let description = proposal.summary;

  if (proposal.metadata) {
    try {
      const metadata = JSON.parse(proposal.metadata);
      title = metadata.title || title;
      description = metadata.description || metadata.summary || description;
    } catch (e) {
      // Ignore parsing errors
    }
  }

  if (!title || !description) {
    const message = proposal.messages[0];
    if (message?.content) {
      title = title || message.content.title;
      description = description || message.content.description || message.content.summary;
    }
  }

  const content: ProposalContent = {
    '@type': proposal.messages[0]?.['@type'] || 'unknown',
    title: title || 'No title available',
    description: description || 'No description available'
  };

  if (proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD') {
    const [govParams, totalStaked] = await Promise.all([
      fetchGovParams(),
      fetchTotalStaked()
    ]);

    const tally = proposal.final_tally_result;
    const yes = BigInt(tally.yes || '0');
    const no = BigInt(tally.no || '0');
    const abstain = BigInt(tally.abstain || '0');
    const noWithVeto = BigInt(tally.no_with_veto || '0');
    const totalVoted = yes + no + abstain + noWithVeto;
    const totalNonAbstain = yes + no + noWithVeto;

    const participation = Number(totalVoted) / totalStaked;
    const yesRatio = totalNonAbstain > 0 ? Number(yes) / Number(totalNonAbstain) : 0;
    const vetoRatio = totalNonAbstain > 0 ? Number(noWithVeto) / Number(totalNonAbstain) : 0;

    return {
      ...proposal,
      proposal_id: proposal.id,
      content,
      final_tally_result: {
        ...tally,
        total_voting_power: totalStaked.toString(),
        quorum_reached: participation >= parseFloat(govParams.tally_params.quorum),
        threshold_reached: yesRatio > parseFloat(govParams.tally_params.threshold),
        veto_threshold_reached: vetoRatio > parseFloat(govParams.tally_params.veto_threshold)
      }
    };
  }

  return {
    ...proposal,
    proposal_id: proposal.id,
    content
  };
};

export const fetchProposals = async (forceRefresh = false): Promise<Proposal[]> => {
  if (!forceRefresh) {
    const cached = getCachedData<Proposal[]>(PROPOSALS_CACHE_KEY);
    if (cached) return cached;
  }

  let allProposals: Proposal[] = [];
  let nextKey: string | null = null;
  const limit = 100;
  
  do {
    const { data } = await api.get('/cosmos/gov/v1/proposals', {
      params: {
        'pagination.key': nextKey,
        'pagination.limit': limit,
        'pagination.reverse': true
      }
    });
    
    if (!data.proposals?.length) break;
    
    const processedProposals = await Promise.all(
      data.proposals.map(processProposal)
    );
    
    allProposals = [...allProposals, ...processedProposals];
    nextKey = data.pagination?.next_key || null;
    
  } while (nextKey);

  allProposals.sort((a, b) => parseInt(b.id) - parseInt(a.id));
  
  setCachedData(PROPOSALS_CACHE_KEY, allProposals);
  return allProposals;
};

export const fetchValidators = async (): Promise<ValidatorWithVotingPower[]> => {
  const { data } = await api.get('/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED');
  const validators = data.validators;
  
  const totalTokens = validators.reduce((sum, v) => sum + parseInt(v.tokens), 0);
  
  return validators
    .map(validator => ({
      ...validator,
      voting_power: parseInt(validator.tokens),
      voting_percentage: (parseInt(validator.tokens) / totalTokens) * 100
    }))
    .sort((a, b) => b.voting_power - a.voting_power);
};