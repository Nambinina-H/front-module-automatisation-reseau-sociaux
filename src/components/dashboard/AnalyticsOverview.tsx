
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import PlatformIcon from '@/components/common/PlatformIcon';

interface AnalyticsOverviewProps {
  className?: string;
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ className }) => {
  // Sample data for analytics
  const data = [
    {
      name: 'Lun',
      linkedin: 4,
      instagram: 5,
      twitter: 2,
      facebook: 3,
    },
    {
      name: 'Mar',
      linkedin: 3,
      instagram: 4,
      twitter: 6,
      facebook: 2,
    },
    {
      name: 'Mer',
      linkedin: 5,
      instagram: 6,
      twitter: 4,
      facebook: 3,
    },
    {
      name: 'Jeu',
      linkedin: 7,
      instagram: 4,
      twitter: 3,
      facebook: 5,
    },
    {
      name: 'Ven',
      linkedin: 6,
      instagram: 8,
      twitter: 5,
      facebook: 4,
    },
    {
      name: 'Sam',
      linkedin: 4,
      instagram: 5,
      twitter: 2,
      facebook: 1,
    },
    {
      name: 'Dim',
      linkedin: 2,
      instagram: 3,
      twitter: 1,
      facebook: 0,
    },
  ];

  const stats = [
    { platform: 'linkedin', label: 'LinkedIn', value: 32, growth: '+12%' },
    { platform: 'instagram', label: 'Instagram', value: 45, growth: '+23%' },
    { platform: 'twitter', label: 'Twitter', value: 27, growth: '+5%' },
    { platform: 'facebook', label: 'Facebook', value: 19, growth: '-3%' },
  ];

  return (
    <Card className={cn('w-full fancy-border', className)}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.platform} className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
              <PlatformIcon platform={stat.platform as any} size={24} />
              <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              <p className={cn(
                'text-xs font-medium',
                stat.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
              )}>
                {stat.growth}
              </p>
              <p className="text-xs text-gray-500 mt-1">Publications</p>
            </div>
          ))}
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                }}
              />
              <Legend />
              <Bar dataKey="linkedin" fill="#0072b1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="instagram" fill="#E1306C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="twitter" fill="#1DA1F2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="facebook" fill="#4267B2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsOverview;
