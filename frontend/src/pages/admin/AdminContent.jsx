import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { getSiteContent, updateSiteContent } from '../../api/api';

export const AdminContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroPrimaryCTA: '',
    heroSecondaryCTA: '',
    communityTitle: '',
    communityDescription: '',
    communityCTA: '',
    aboutTitle: '',
    aboutDescription: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    footerTagline: '',
    features: [
      { title: '', description: '', icon: 'users' },
      { title: '', description: '', icon: 'calendar' },
      { title: '', description: '', icon: 'image' }
    ]
  });
  const { toast } = useToast();

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      const data = await getSiteContent();
      setFormData(data);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger le contenu", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteContent(formData);
      toast({ title: "Succès", description: "Contenu mis à jour" });
      await fetchContent();
    } catch (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1B6D]"></div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Modifier le Contenu du Site</h2>
        <Button onClick={handleSubmit} disabled={isSaving} className="bg-[#FF1B6D] hover:bg-[#E01660] text-white">
          <Save size={18} className="mr-2" />{isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Héro */}
        <Card>
          <CardHeader><CardTitle>Section Héro (Page d'accueil)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label htmlFor="heroTitle">Titre principal</Label><Input id="heroTitle" value={formData.heroTitle} onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })} /></div>
            <div><Label htmlFor="heroSubtitle">Sous-titre</Label><Input id="heroSubtitle" value={formData.heroSubtitle} onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="heroPrimaryCTA">Bouton principal</Label><Input id="heroPrimaryCTA" value={formData.heroPrimaryCTA} onChange={(e) => setFormData({ ...formData, heroPrimaryCTA: e.target.value })} /></div>
              <div><Label htmlFor="heroSecondaryCTA">Bouton secondaire</Label><Input id="heroSecondaryCTA" value={formData.heroSecondaryCTA} onChange={(e) => setFormData({ ...formData, heroSecondaryCTA: e.target.value })} /></div>
            </div>
          </CardContent>
        </Card>

        {/* Section Features */}
        <Card>
          <CardHeader><CardTitle>Section "Pourquoi Nous Choisir"</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {formData.features.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <h4 className="font-bold text-gray-900">Feature {index + 1}</h4>
                <div><Label htmlFor={`feature${index}Title`}>Titre</Label><Input id={`feature${index}Title`} value={feature.title} onChange={(e) => updateFeature(index, 'title', e.target.value)} /></div>
                <div><Label htmlFor={`feature${index}Desc`}>Description</Label><Textarea id={`feature${index}Desc`} value={feature.description} onChange={(e) => updateFeature(index, 'description', e.target.value)} rows={3} /></div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Section Communauté */}
        <Card>
          <CardHeader><CardTitle>Section Communauté</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label htmlFor="communityTitle">Titre</Label><Input id="communityTitle" value={formData.communityTitle} onChange={(e) => setFormData({ ...formData, communityTitle: e.target.value })} /></div>
            <div><Label htmlFor="communityDescription">Description</Label><Textarea id="communityDescription" value={formData.communityDescription} onChange={(e) => setFormData({ ...formData, communityDescription: e.target.value })} rows={4} /></div>
            <div><Label htmlFor="communityCTA">Texte du bouton</Label><Input id="communityCTA" value={formData.communityCTA} onChange={(e) => setFormData({ ...formData, communityCTA: e.target.value })} /></div>
          </CardContent>
        </Card>

        {/* Section À Propos */}
        <Card>
          <CardHeader><CardTitle>Page À Propos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label htmlFor="aboutTitle">Titre</Label><Input id="aboutTitle" value={formData.aboutTitle || ''} onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })} /></div>
            <div><Label htmlFor="aboutDescription">Description</Label><Textarea id="aboutDescription" value={formData.aboutDescription || ''} onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })} rows={4} /></div>
          </CardContent>
        </Card>

        {/* Informations de Contact */}
        <Card>
          <CardHeader><CardTitle>Page Contact & Footer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label htmlFor="contactEmail">Email de contact</Label><Input id="contactEmail" type="email" value={formData.contactEmail || ''} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} /></div>
            <div><Label htmlFor="contactPhone">Téléphone</Label><Input id="contactPhone" value={formData.contactPhone || ''} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} /></div>
            <div><Label htmlFor="contactAddress">Adresse</Label><Input id="contactAddress" value={formData.contactAddress || ''} onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })} /></div>
            <div><Label htmlFor="footerTagline">Slogan footer</Label><Input id="footerTagline" value={formData.footerTagline || ''} onChange={(e) => setFormData({ ...formData, footerTagline: e.target.value })} placeholder="Cultures Urbaines – Événements – Expositions" /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="bg-[#FF1B6D] hover:bg-[#E01660] text-white px-8">
            <Save size={18} className="mr-2" />{isSaving ? 'Enregistrement...' : 'Enregistrer toutes les modifications'}
          </Button>
        </div>
      </form>
    </div>
  );
};
