import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Play } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { getVideos, createVideo, updateVideo, deleteVideo } from '../../api/api';

export const AdminVideos = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', videoUrl: '', thumbnailUrl: '' });
  const { toast } = useToast();

  useEffect(() => { fetchVideos(); }, []);

  const fetchVideos = async () => {
    try {
      const data = await getVideos();
      setVideos(data);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les vidéos", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateVideo(editing.id, formData);
        toast({ title: "Succès", description: "Vidéo mise à jour" });
      } else {
        await createVideo(formData);
        toast({ title: "Succès", description: "Vidéo ajoutée" });
      }
      fetchVideos();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      try {
        await deleteVideo(id);
        toast({ title: "Succès", description: "Vidéo supprimée" });
        fetchVideos();
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
      }
    }
  };

  const handleEdit = (video) => {
    setEditing(video);
    setFormData({ title: video.title, description: video.description || '', videoUrl: video.videoUrl, thumbnailUrl: video.thumbnailUrl || '' });
    setIsDialogOpen(true);
  };

  const resetForm = () => { setEditing(null); setFormData({ title: '', description: '', videoUrl: '', thumbnailUrl: '' }); };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1B6D]"></div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Gestion des Vidéos</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF1B6D] hover:bg-[#E01660] text-white"><Plus size={18} className="mr-2" />Ajouter une Vidéo</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? 'Modifier la vidéo' : 'Ajouter une vidéo'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div><Label htmlFor="title">Titre</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
              <div><Label htmlFor="videoUrl">URL de la vidéo</Label><Input id="videoUrl" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} placeholder="https://..." required /></div>
              <div><Label htmlFor="thumbnailUrl">URL miniature (optionnel)</Label><Input id="thumbnailUrl" value={formData.thumbnailUrl} onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })} placeholder="https://..." /></div>
              <div><Label htmlFor="description">Description (optionnel)</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-[#FF1B6D] hover:bg-[#E01660]">{editing ? 'Mettre à jour' : 'Ajouter'}</Button>
                <Button type="button" variant="outline" onClick={() => { resetForm(); setIsDialogOpen(false); }} className="flex-1">Annuler</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <motion.div key={video.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-black">
                {video.thumbnailUrl ? <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" /> : <video src={video.videoUrl} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="w-12 h-12 bg-[#FF1B6D] rounded-full flex items-center justify-center"><Play size={20} className="text-white ml-1" /></div></div>
              </div>
              <CardHeader><CardTitle className="text-lg">{video.title}</CardTitle></CardHeader>
              <CardContent>
                {video.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{video.description}</p>}
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(video)} size="sm" variant="outline" className="flex-1"><Pencil size={14} className="mr-1" />Modifier</Button>
                  <Button onClick={() => handleDelete(video.id)} size="sm" variant="destructive" className="flex-1"><Trash2 size={14} className="mr-1" />Supprimer</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {videos.length === 0 && <Card className="p-12 text-center"><p className="text-gray-500 text-lg">Aucune vidéo. Ajoutez-en une !</p></Card>}
    </div>
  );
};
