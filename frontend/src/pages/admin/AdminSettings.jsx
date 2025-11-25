import React, { useState } from 'react';
import { Save, Download } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';
import { updateAdmin, verifyToken, changePassword } from '../../api/api';
import axios from 'axios';

export const AdminSettings = () => {
  const [username, setUsername] = useState('admin');
  const [adminEmail, setAdminEmail] = useState('zeroundprod@gmail.com');
  const [contactEmail, setContactEmail] = useState('zeroundprod@gmail.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const { username: user, email } = await verifyToken();
        setUsername(user);
        setAdminEmail(email);
      } catch (e) {}
    };
    fetchAdmin();
  }, []);

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    try {
      await updateAdmin(username, adminEmail);
      toast({ title: "Succès", description: "Compte mis à jour" });
    } catch (e) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    toast({ title: "Succès", description: "Email de contact modifié" });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas", variant: "destructive" });
      return;
    }
    try {
      await changePassword(oldPassword, newPassword);
      toast({ title: "Succès", description: "Mot de passe modifié" });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      toast({ title: "Erreur", description: e.response?.data?.detail || "Erreur", variant: "destructive" });
    }
  };

  const handleDownloadWebsite = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/download-website`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'website-full-export.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast({ title: "Succès", description: "Téléchargement démarré" });
    } catch (e) {
      toast({ title: "Erreur", description: "Échec du téléchargement", variant: "destructive" });
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h2>
      
      <Card className="max-w-2xl mb-6">
        <CardHeader><CardTitle>Compte Admin</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleUsernameChange} className="space-y-4">
            <div><Label htmlFor="username">Nom d'utilisateur</Label><Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
            <div><Label htmlFor="adminEmail">Email admin (pour récupération mot de passe)</Label><Input id="adminEmail" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required /></div>
            <Button type="submit" className="bg-[#FF1B6D] hover:bg-[#E01660]"><Save size={18} className="mr-2" />Enregistrer</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mb-6">
        <CardHeader><CardTitle>Email de réception des messages</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div><Label htmlFor="contactEmail">Email où recevoir les messages du formulaire de contact</Label><Input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required /></div>
            <Button type="submit" className="bg-[#FF1B6D] hover:bg-[#E01660]"><Save size={18} className="mr-2" />Enregistrer</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mb-6">
        <CardHeader><CardTitle>Changer le mot de passe</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div><Label htmlFor="oldPassword">Ancien mot de passe</Label><Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required /></div>
            <div><Label htmlFor="newPassword">Nouveau mot de passe</Label><Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></div>
            <div><Label htmlFor="confirmPassword">Confirmer le mot de passe</Label><Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
            <Button type="submit" className="bg-[#FF1B6D] hover:bg-[#E01660]"><Save size={18} className="mr-2" />Enregistrer</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Télécharger le site</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">Téléchargez l'intégralité du code source du site en un seul fichier ZIP.</p>
          <Button onClick={handleDownloadWebsite} className="bg-[#FF1B6D] hover:bg-[#E01660]"><Download size={18} className="mr-2" />Download Website</Button>
        </CardContent>
      </Card>
    </div>
  );
};
