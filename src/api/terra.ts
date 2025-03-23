import axios from 'axios';

const LCD_ENDPOINT = 'https://terra-classic-lcd.publicnode.com';

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

export interface Proposal {
  proposal_id: string;
  content: {
    '@type': string;
    title: string;
    description: string;
  };
  status: string;
  final_tally_result: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  };
  submit_time: string;
  deposit_end_time: string;
  total_deposit: Array<{
    denom: string;
    amount: string;
  }>;
  voting_start_time: string;
  voting_end_time: string;
}

export interface ValidatorWithVotingPower extends Validator {
  voting_power: number;
  voting_percentage: number;
}

const api = axios.create({
  baseURL: LCD_ENDPOINT,
});

export const fetchValidators = async (): Promise<ValidatorWithVotingPower[]> => {
  const { data } = await api.get('/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED');
  const validators = data.validators as Validator[];

  // Calculate total voting power
  const totalTokens = validators.reduce((sum, validator) => {
    return sum + parseInt(validator.tokens);
  }, 0);

  // Add voting power percentage to each validator
  return validators
    .map(validator => ({
      ...validator,
      voting_power: parseInt(validator.tokens),
      voting_percentage: (parseInt(validator.tokens) / totalTokens) * 100
    }))
    .sort((a, b) => b.voting_power - a.voting_power);
};

export const fetchProposals = async (): Promise<Proposal[]> => {
  const { data } = await api.get('/cosmos/gov/v1beta1/proposals');
  return data.proposals.sort((a, b) => parseInt(b.proposal_id) - parseInt(a.proposal_id));
};