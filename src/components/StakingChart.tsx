import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../App';
import { formatLargeNumber } from '../utils/format';

// Mock data - in production, this would come from your API
const generateStakingData = () => {
  const baseStaked = 1_003_392_059_053;
  const baseUnstaked = 50_000_000_000;
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    staked: baseStaked + (Math.random() - 0.5) * baseStaked * 0.1,
    unstaked: baseUnstaked + (Math.random() - 0.5) * baseUnstaked * 0.2,
    rewards: (baseStaked * 0.00001) * (1 + (Math.random() - 0.5) * 0.3)
  }));
};

interface StakingChartProps {
  type: 'staked' | 'unstaked' | 'rewards';
  title: string;
  color: string;
}

const StakingChart: React.FC<StakingChartProps> = ({ type, title, color }) => {
  const { isDark } = useTheme();
  const data = generateStakingData();

  return (
    <div className={`${isDark ? 'bg-gray-800/30' : 'bg-white'} rounded-xl p-6 backdrop-blur-sm`}>
      <h3 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{title}</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: isDark ? '#9CA3AF' : '#4B5563' }}
              axisLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }}
              tickLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }}
              tickFormatter={(value) => value.split('-')[2]}
            />
            <YAxis
              tick={{ fill: isDark ? '#9CA3AF' : '#4B5563' }}
              axisLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }}
              tickLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }}
              tickFormatter={(value) => formatLargeNumber(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              formatter={(value: number) => [formatLargeNumber(value), type.charAt(0).toUpperCase() + type.slice(1)]}
              labelFormatter={(label: string) => new Date(label).toLocaleDateString()}
            />
            <Area
              type="monotone"
              dataKey={type}
              stroke={color}
              fill={`url(#gradient-${type})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StakingChart;