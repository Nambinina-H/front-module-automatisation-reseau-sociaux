
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PlatformIcon from '@/components/common/PlatformIcon';
import { Clock, Calendar as CalendarIcon, Plus } from 'lucide-react';
import Button from '@/components/common/Button';
import { DateTimePicker } from '@/components/common/DateTimePicker';

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [newScheduleDate, setNewScheduleDate] = useState<Date | undefined>(new Date());
  
  // Sample scheduled posts data - in a real app this would come from an API
  const scheduledPosts = [
    {
      id: '1',
      title: 'Lancement de notre nouveau produit',
      platforms: ['linkedin', 'twitter', 'facebook'] as ('linkedin' | 'twitter' | 'facebook' | 'instagram')[],
      scheduledDate: new Date('2023-06-15T10:00:00'),
    },
    {
      id: '2',
      title: 'Astuces pour améliorer votre productivité',
      platforms: ['linkedin', 'instagram'] as ('linkedin' | 'twitter' | 'facebook' | 'instagram')[],
      scheduledDate: new Date('2023-06-17T14:30:00'),
    },
    {
      id: '3',
      title: 'Événement annuel de networking',
      platforms: ['linkedin', 'facebook', 'twitter', 'instagram'] as ('linkedin' | 'twitter' | 'facebook' | 'instagram')[],
      scheduledDate: new Date('2023-06-10T18:00:00'),
    },
  ];
  
  // Filter posts for the selected date
  const postsForSelectedDate = date 
    ? scheduledPosts.filter(post => 
        post.scheduledDate.getDate() === date.getDate() &&
        post.scheduledDate.getMonth() === date.getMonth() &&
        post.scheduledDate.getFullYear() === date.getFullYear()
      ) 
    : [];

  const handleAddNewSchedule = () => {
    // Cette fonction serait implémentée pour ajouter une nouvelle planification
    console.log("Nouvelle planification:", newScheduleDate);
    setShowDateTimePicker(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Planification</h1>
            <Button iconLeft={<Plus size={16} />} onClick={() => setShowDateTimePicker(true)}>
              Nouvelle planification
            </Button>
          </div>
          
          {showDateTimePicker && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Ajouter une nouvelle planification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <DateTimePicker 
                    date={newScheduleDate} 
                    setDate={setNewScheduleDate} 
                    placeholder="Sélectionner date et heure" 
                  />
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setShowDateTimePicker(false)}>Annuler</Button>
                    <Button onClick={handleAddNewSchedule}>Ajouter</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Calendrier</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    locale={fr}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    Posts planifiés pour {date ? format(date, 'dd MMMM yyyy', { locale: fr }) : 'aujourd\'hui'}
                  </CardTitle>
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                </CardHeader>
                <CardContent>
                  {postsForSelectedDate.length > 0 ? (
                    <div className="space-y-4">
                      {postsForSelectedDate.map((post) => (
                        <div key={post.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{post.title}</h3>
                              <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {format(post.scheduledDate, 'HH:mm')}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              {post.platforms.map(platform => (
                                <PlatformIcon key={platform} platform={platform} size={18} />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p>Aucun post planifié pour cette date</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Schedule;
