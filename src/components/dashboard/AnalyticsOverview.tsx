import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import PlatformIcon from '@/components/common/PlatformIcon';
import { useWeeklyAnalytics } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';

interface AnalyticsOverviewProps {
  className?: string;
}

// Fonction helper pour utiliser exactement la date ISO de l'API au format DD/MM/YYYY
const formatDate = (isoDate: string): string => {
  if (!isoDate) return '';
  
  // Extraire simplement la date (YYYY-MM-DD) de la chaîne ISO
  const datePart = isoDate.split('T')[0];
  // Diviser et réorganiser en format DD/MM/YYYY
  const [year, month, day] = datePart.split('-');
  
  return `${day}/${month}/${year}`;
};

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ className }) => {
  const { data, loading, error, fetchWeeklyStats } = useWeeklyAnalytics();

  // Charger les données une seule fois au montage du composant
  useEffect(() => {
    fetchWeeklyStats().catch(error => {
      console.error("Erreur lors du chargement des analytics:", error);
    });
  }, [fetchWeeklyStats]);

  // Données statiques de secours au cas où l'API échoue
  const fallbackData = [
    {
      name: 'Lun',
      wordpress: 6,
      facebook: 3,
      twitter: 2,
      linkedin: 4,
      instagram: 5,
      total: 20,
    },
    {
      name: 'Mar',
      wordpress: 4,
      facebook: 2,
      twitter: 6,
      linkedin: 3,
      instagram: 4,
      total: 19,
    },
    {
      name: 'Mer',
      wordpress: 5,
      facebook: 3,
      twitter: 4,
      linkedin: 5,
      instagram: 6,
      total: 23,
    },
    {
      name: 'Jeu',
      wordpress: 4,
      facebook: 5,
      twitter: 3,
      linkedin: 7,
      instagram: 4,
      total: 23,
    },
    {
      name: 'Ven',
      wordpress: 7,
      facebook: 4,
      twitter: 5,
      linkedin: 6,
      instagram: 8,
      total: 30,
    },
    {
      name: 'Sam',
      wordpress: 3,
      facebook: 1,
      twitter: 2,
      linkedin: 4,
      instagram: 5,
      total: 15,
    },
    {
      name: 'Dim',
      wordpress: 1,
      facebook: 0,
      twitter: 1,
      linkedin: 2,
      instagram: 3,
      total: 7,
    },
  ];

  const fallbackStats = [
    { platform: 'wordpress', label: 'WordPress', value: 30 },
    { platform: 'facebook', label: 'Facebook', value: 19 },
    { platform: 'twitter', label: 'Twitter', value: 27 },
    { platform: 'linkedin', label: 'LinkedIn', value: 32 },
    { platform: 'instagram', label: 'Instagram', value: 45 },
  ];

  // Utiliser les données de l'API ou les données de secours en cas d'erreur
  const chartData = data?.dailyData || fallbackData;
  
  // Préparer les statistiques par plateforme à partir des totaux de l'API
  const platformStats = data ? [
    { platform: 'wordpress', label: 'WordPress', value: data.platformTotals.wordpress },
    { platform: 'facebook', label: 'Facebook', value: data.platformTotals.facebook },
    { platform: 'twitter', label: 'Twitter', value: data.platformTotals.twitter },
    { platform: 'linkedin', label: 'LinkedIn', value: data.platformTotals.linkedin },
    { platform: 'instagram', label: 'Instagram', value: data.platformTotals.instagram },
  ] : fallbackStats;

  // Préparer la description de la période en utilisant les dates exactes de l'API
  const periodDescription = data?.period 
    ? `Statistiques hebdomadaires du ${formatDate(data.period.startDate)} au ${formatDate(data.period.endDate)}`
    : 'Statistiques hebdomadaires';

  return (
    <Card className={cn('w-full fancy-border', className)}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Analytics</CardTitle>
        {!loading && data?.period && (
          <CardDescription>{periodDescription}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-72 w-full" />
          </>
        ) : (
          <>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {platformStats.map((stat) => (
                <div key={stat.platform} className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                  <PlatformIcon platform={stat.platform as any} size={24} />
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">Publications</p>
                </div>
              ))}
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
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
                  <Bar dataKey="wordpress" fill="#21759b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="facebook" fill="#4267B2" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="twitter" fill="#1DA1F2" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="linkedin" fill="#0072b1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="instagram" fill="#E1306C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsOverview;
