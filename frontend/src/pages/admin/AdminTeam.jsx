import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../../api/api';

export const AdminTeam = () => {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    imageUrl: '',
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const data = await getTeamMembers();
      setTeam(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger l'équipe",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateTeamMember(editing.id, formData);
        toast({ title: "Succès", description: "Membre mis à jour" });
      } else {
        await createTeamMember(formData);
        toast({ title: "Succès", description: "Membre ajouté" });
      }
      fetchTeam();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      try {
        await deleteTeamMember(id);
        toast({ title: "Succès", description: "Membre supprimé" });
        fetchTeam();
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
      }
    }
  };

  const handleEdit = (member) => {
    setEditing(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      imageUrl: member.imageUrl,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({ name: '', role: '', bio: '', imageUrl: '' });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1B6D]"></div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Gestion de l'Équipe</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF1B6D] hover:bg-[#E01660] text-white">
              <Plus size={18} className="mr-2" />Ajouter un Membre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? 'Modifier le membre' : 'Ajouter un membre'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div><Label htmlFor="name">Nom</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div><Label htmlFor="role">Rôle</Label><Input id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required /></div>
              <div><Label htmlFor="bio">Bio (optionnel)</Label><Textarea id="bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} /></div>
              <div><Label htmlFor="imageUrl">URL de l'image</Label><Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." required /></div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-[#FF1B6D] hover:bg-[#E01660]">{editing ? 'Mettre à jour' : 'Ajouter'}</Button>
                <Button type="button" variant="outline" onClick={() => { resetForm(); setIsDialogOpen(false); }} className="flex-1">Annuler</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64"><img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" /></div>
              <CardHeader>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <p className="text-[#FF1B6D] font-medium">{member.role}</p>
              </CardHeader>
              <CardContent>
                {member.bio && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{member.bio}</p>}
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(member)} size="sm" variant="outline" className="flex-1"><Pencil size={14} className="mr-1" />Modifier</Button>
                  <Button onClick={() => handleDelete(member.id)} size="sm" variant="destructive" className="flex-1"><Trash2 size={14} className="mr-1" />Supprimer</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {team.length === 0 && <Card className="p-12 text-center"><p className="text-gray-500 text-lg">Aucun membre. Ajoutez-en un !</p></Card>}
    </div>
  );
};
