import React from 'react';
import { useQuery } from 'react-query';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../App';

// Mock data for charts - in production, this would come from your API
const generateChartData = (basePrice: number, volatility: number) => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: basePrice + (Math.random() - 0.5) * volatility * basePrice
  }));
};

const formatPrice = (price: number) => {
  return price < 0.01 ? price.toFixed(8) : price.toFixed(4);
};

const PriceFeeds = () => {
  const { isDark } = useTheme();
  
  const { data: prices } = useQuery('prices', () => 
    // This would be replaced with actual API calls
    Promise.resolve({
      LUNC: { price: 0.00015, change: 5.2, chartData: generateChartData(0.00015, 0.1), color: '#FFD700' }, // Yellow
      USTC: { price: 0.02, change: -2.1, chartData: generateChartData(0.02, 0.05), color: '#3B82F6' }, // Blue
      TERRA: { price: 0.85, change: 3.4, chartData: generateChartData(0.85, 0.08), color: '#3B82F6', gradientColors: ['#3B82F6', '#FFD700'] }, // Blue line with blue-yellow gradient
      JURIS: { price: 0.12, change: 7.8, chartData: generateChartData(0.12, 0.15), color: '#3B82F6', gradientColors: ['#EF4444', '#FFFFFF', '#3B82F6'] } // Blue line with red-white-blue gradient
    })
  );

  const getGradientId = (token: string) => `colorGradient-${token}`;

  const PriceChart = ({ token, data }: { token: string; data: any }) => (
    <div className={`${isDark ? 'bg-gray-800/80' : 'bg-white shadow-lg'} rounded-xl p-6 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">{token}</h3>
          <p className="text-2xl font-bold mt-1">${formatPrice(data.price)}</p>
        </div>
        <div className={`flex items-center ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {data.change >= 0 ? <TrendingUp className="w-5 h-5 mr-2" /> : <TrendingDown className="w-5 h-5 mr-2" />}
          <span className="text-lg font-semibold">{data.change >= 0 ? '+' : ''}{data.change}%</span>
        </div>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.chartData}>
            <defs>
              {data.gradientColors ? (
                <linearGradient id={getGradientId(token)} x1="0" y1="0" x2="0" y2="1">
                  {data.gradientColors.map((color: string, index: number) => (
                    <stop
                      key={index}
                      offset={`${(index * 100) / (data.gradientColors.length - 1)}%`}
                      stopColor={color}
                      stopOpacity={0.3}
                    />
                  ))}
                </linearGradient>
              ) : (
                <linearGradient id={getGradientId(token)} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={data.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={data.color} stopOpacity={0}/>
                </linearGradient>
              )}
            </defs>
            <XAxis 
              dataKey="time" 
              tick={{ fill: isDark ? '#9CA3AF' : '#4B5563' }}
              axisLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }}
              tickLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }}
            />
            <YAxis 
              domain={['dataMin', 'dataMax']}
              tick={{ fill: isDark ? '#9CA3AF' : '#4B5563' }}
              axisLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }}
              tickLine={{ stroke: isDark ? '#374151' : '#E5E7EB' }}
              tickFormatter={(value) => formatPrice(value)}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: 'none',
                borderRadius: '0.5rem',
                color: isDark ? '#F3F4F6' : '#1F2937',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={data.color}
              fill={`url(#${getGradientId(token)})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        24-hour price history
      </div>
    </div>
  );

  return (
    <section id="priceFeeds" className="py-16 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className={`${isDark ? 'bg-gray-800/50' : 'bg-white shadow-lg'} rounded-2xl p-8 backdrop-blur-sm`}>
            <h2 className="text-4xl font-bold mb-6">
              Terra <span className="text-yellow-400">Luna</span> Classic
            </h2>
            <div className="space-y-6">
              <p className={`text-xl ${isDark ? 'text-gray-200' : 'text-gray-700'} leading-relaxed`}>
                Terra Luna Classic (LUNC) is a robust, open-source blockchain protocol built on the powerful Cosmos SDK. It combines high-throughput capabilities with cross-chain interoperability, enabling a new era of decentralized finance.
              </p>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                Powered by a delegated Proof-of-Stake consensus mechanism and secured by a network of validators, Terra Luna Classic facilitates fast, secure transactions while maintaining decentralization. The ecosystem features a dynamic multi-token economy, including LUNC for staking and governance, USTC for stable transactions, and various other tokens powering specialized applications.
              </p>
              <div className="grid md:grid-cols-2 gap-8 pt-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-500 mb-4">Technical Features</h3>
                  <ul className="space-y-3">
                    <li className={`flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Cosmos SDK-based architecture
                    </li>
                    <li className={`flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Tendermint consensus engine
                    </li>
                    <li className={`flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      IBC protocol support
                    </li>
                    <li className={`flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Smart contract capability
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-500 mb-4">Ecosystem Benefits</h3>
                  <ul className="space-y-3">
                    <li className={`flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                      High transaction throughput
                    </li>
                    <li className={`flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                      Low transaction fees
                    </li>
                    <li className={`flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                      Community governance
                    </li>
                    <li className={`flex items-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                      Staking rewards
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            {prices && ['LUNC', 'USTC'].map((token) => (
              <PriceChart key={token} token={token} data={prices[token]} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {prices && ['TERRA', 'JURIS'].map((token) => (
            <PriceChart key={token} token={token} data={prices[token]} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriceFeeds;