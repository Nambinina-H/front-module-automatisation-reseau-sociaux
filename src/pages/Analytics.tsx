import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlatformIcon from '@/components/common/PlatformIcon';
import { Calendar } from '@/components/ui/calendar';
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const Analytics = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Sample data for analytics
  const weeklyData = [
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
  
  const monthlyData = Array.from({ length: 30 }, (_, i) => {
    const day = format(subDays(new Date(), 29 - i), 'dd/MM');
    return {
      name: day,
      wordpress: Math.floor(Math.random() * 7) + 1,
      facebook: Math.floor(Math.random() * 6) + 1,
      twitter: Math.floor(Math.random() * 8) + 1,
      linkedin: Math.floor(Math.random() * 10) + 1,
      instagram: Math.floor(Math.random() * 10) + 1,
    };
  });
  
  const platformDistribution = [
    { name: 'WordPress', value: 20, color: '#21759b' },
    { name: 'Facebook', value: 8, color: '#4267B2' },
    { name: 'Twitter', value: 12, color: '#1DA1F2' },
    { name: 'LinkedIn', value: 35, color: '#0072b1' },
    { name: 'Instagram', value: 25, color: '#E1306C' },
  ];
  
  const keywordPerformance = [
    { name: 'innovation', engagement: 85 },
    { name: 'technologie', engagement: 70 },
    { name: 'marketing', engagement: 65 },
    { name: 'croissance', engagement: 60 },
    { name: 'événement', engagement: 55 },
    { name: 'webinaire', engagement: 50 },
    { name: 'produit', engagement: 45 },
    { name: 'stratégie', engagement: 40 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Analytiques</h1>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {date ? format(date, 'dd MMMM yyyy', { locale: fr }) : 'Sélectionner une date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              { platform: 'wordpress', label: 'WordPress', value: 20 },
              { platform: 'facebook', label: 'Facebook', value: 8 },
              { platform: 'twitter', label: 'Twitter', value: 12 },
              { platform: 'linkedin', label: 'LinkedIn', value: 35 },
              { platform: 'instagram', label: 'Instagram', value: 25 },
            ].map((stat) => (
              <Card key={stat.platform} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}%</p>
                      <p className="text-xs text-gray-500 mt-1">Publications</p>
                    </div>
                    <PlatformIcon platform={stat.platform as any} size={24} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Aperçu</span>
              </TabsTrigger>
              <TabsTrigger value="platforms" className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" />
                <span>Plateformes</span>
              </TabsTrigger>
              <TabsTrigger value="keywords" className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" />
                <span>Mots-clés</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Vue d'ensemble des publications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weeklyData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Tendance mensuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={5} />
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
                        <Line type="monotone" dataKey="total" stroke="#6366F1" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="wordpress" stroke="#21759b" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="facebook" stroke="#4267B2" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="twitter" stroke="#1DA1F2" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="linkedin" stroke="#0072b1" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="platforms" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Distribution des publications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={platformDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {platformDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Performance par plateforme</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={[
                            { name: 'WordPress', value: 70 },
                            { name: 'Facebook', value: 35 },
                            { name: 'Twitter', value: 42 },
                            { name: 'LinkedIn', value: 78 },
                            { name: 'Instagram', value: 65 },
                          ]}
                          margin={{ top: 10, right: 10, left: 70, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={70} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                            }}
                            formatter={(value) => [`${value}% d'engagement`, 'Performance']}
                          />
                          <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="keywords" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Performance des mots-clés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={keywordPerformance}
                        margin={{ top: 10, right: 10, left: 80, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                          }}
                          formatter={(value) => [`${value}% d'engagement`, 'Performance']}
                        />
                        <Bar dataKey="engagement" fill="#22C55E" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
