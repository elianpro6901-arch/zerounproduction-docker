import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { adminLogin } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/events');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await adminLogin(username, password);
      login(data.access_token, username);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans le panel admin",
      });
      navigate('/admin/events');
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Nom d'utilisateur ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-[#FF1B6D] p-3 rounded-full">
                <Lock size={32} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-black text-gray-900">
              Admin Panel
            </CardTitle>
            <p className="text-gray-600 text-sm mt-2">Breakdance Crew</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="admin"
                />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF1B6D] hover:bg-[#E01660] text-white font-bold py-6"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button 
                type="button"
                onClick={() => {
                  const email = prompt("Entrez votre email admin:");
                  if(email) {
                    toast({ title: "Email envoyé", description: `Lien de réinitialisation envoyé à ${email}` });
                  }
                }}
                className="text-[#FF1B6D] hover:text-[#E01660] text-sm font-medium"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};