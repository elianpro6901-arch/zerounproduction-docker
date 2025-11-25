import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { useToast } from '../../hooks/use-toast';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../api/api';

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    imageUrl: '',
    featured: false,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les événements",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
        toast({
          title: "Succès",
          description: "Événement mis à jour",
        });
      } else {
        await createEvent(formData);
        toast({
          title: "Succès",
          description: "Événement créé",
        });
      }
      fetchEvents();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await deleteEvent(eventId);
        toast({
          title: "Succès",
          description: "Événement supprimé",
        });
        fetchEvents();
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'événement",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
      imageUrl: event.imageUrl,
      featured: event.featured,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      date: '',
      location: '',
      description: '',
      imageUrl: '',
      featured: false,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1B6D]"></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Événements</h2>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-[#FF1B6D] hover:bg-[#E01660] text-white">
                  <Plus size={18} className="mr-2" />
                  Nouvel Événement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      placeholder="Ex: 12 Déc 2025"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Lieu</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">URL de l'image</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <Label htmlFor="featured">Événement mis en avant</Label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 bg-[#FF1B6D] hover:bg-[#E01660]">
                      {editingEvent ? 'Mettre à jour' : 'Créer'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        setIsDialogOpen(false);
                      }}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {event.featured && (
                      <div className="absolute top-2 right-2 bg-[#FF1B6D] text-white px-3 py-1 rounded-full text-xs font-bold">
                        Featured
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <Calendar size={14} className="mr-2" />
                      {event.date}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(event)}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <Pencil size={14} className="mr-1" />
                        Modifier
                      </Button>
                      <Button
                        onClick={() => handleDelete(event.id)}
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {events.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-500 text-lg">Aucun événement. Créez-en un !</p>
            </Card>
          )}
      </motion.div>
    </div>
  );
};