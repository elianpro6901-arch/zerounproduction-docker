import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Calendar, Users, Image, Video, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

export const AdminLayout = ({ children }) => {
  const { logout, username } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate('/admin');
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  const navItems = [
    { path: '/admin/events', label: 'Événements', icon: Calendar },
    { path: '/admin/team', label: 'Équipe', icon: Users },
    { path: '/admin/gallery', label: 'Galerie', icon: Image },
    { path: '/admin/videos', label: 'Vidéos', icon: Video },
    { path: '/admin/content', label: 'Contenu Site', icon: FileText },
    { path: '/admin/settings', label: 'Paramètres', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#FF1B6D]">zerounproduction</h1>
              <p className="text-sm text-gray-600">Panel Admin - Bienvenue {username}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-300 hover:border-[#FF1B6D] hover:text-[#FF1B6D]"
            >
              <LogOut size={18} className="mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? 'text-[#FF1B6D] border-[#FF1B6D]'
                      : 'text-gray-600 border-transparent hover:text-[#FF1B6D]'
                  }`}
                >
                  <Icon size={18} className="mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
