import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../api/api';

export const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '' });
  const { toast } = useToast();

  useEffect(() => { fetchGallery(); }, []);

  const fetchGallery = async () => {
    try {
      const data = await getGalleryItems();
      setGallery(data);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger la galerie", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateGalleryItem(editing.id, formData);
        toast({ title: "Succès", description: "Image mise à jour" });
      } else {
        await createGalleryItem(formData);
        toast({ title: "Succès", description: "Image ajoutée" });
      }
      fetchGallery();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      try {
        await deleteGalleryItem(id);
        toast({ title: "Succès", description: "Image supprimée" });
        fetchGallery();
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
      }
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormData({ title: item.title || '', description: item.description || '', imageUrl: item.imageUrl });
    setIsDialogOpen(true);
  };

  const resetForm = () => { setEditing(null); setFormData({ title: '', description: '', imageUrl: '' }); };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1B6D]"></div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Gestion de la Galerie</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF1B6D] hover:bg-[#E01660] text-white"><Plus size={18} className="mr-2" />Ajouter une Image</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? 'Modifier l\'image' : 'Ajouter une image'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div><Label htmlFor="imageUrl">URL de l'image</Label><Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." required /></div>
              <div><Label htmlFor="title">Titre (optionnel)</Label><Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
              <div><Label htmlFor="description">Description (optionnel)</Label><Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-[#FF1B6D] hover:bg-[#E01660]">{editing ? 'Mettre à jour' : 'Ajouter'}</Button>
                <Button type="button" variant="outline" onClick={() => { resetForm(); setIsDialogOpen(false); }} className="flex-1">Annuler</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gallery.map((item, index) => (
          <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square"><img src={item.imageUrl} alt={item.title || 'Gallery'} className="w-full h-full object-cover" /></div>
              <CardContent className="p-4">
                {item.title && <p className="font-bold text-sm mb-2">{item.title}</p>}
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(item)} size="sm" variant="outline" className="flex-1"><Pencil size={14} className="mr-1" />Modifier</Button>
                  <Button onClick={() => handleDelete(item.id)} size="sm" variant="destructive" className="flex-1"><Trash2 size={14} className="mr-1" />Supprimer</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {gallery.length === 0 && <Card className="p-12 text-center"><p className="text-gray-500 text-lg">Aucune image. Ajoutez-en une !</p></Card>}
    </div>
  );
};
