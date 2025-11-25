import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SiteContentProvider } from './contexts/SiteContentContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { APropos } from './pages/APropos';
import { Equipe } from './pages/Equipe';
import { Galerie } from './pages/Galerie';
import { Videos } from './pages/Videos';
import { Evenements } from './pages/Evenements';
import { Contact } from './pages/Contact';
import { Partenaires } from './pages/Partenaires';
import { AdminLogin } from './pages/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminTeam } from './pages/admin/AdminTeam';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminVideos } from './pages/admin/AdminVideos';
import { AdminContent } from './pages/admin/AdminContent';
import { AdminSettings } from './pages/admin/AdminSettings';
import { Toaster } from './components/ui/sonner';

const PublicLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <SiteContentProvider>
        <BrowserRouter>
          <div className="App">
          <Routes>
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/a-propos" element={<PublicLayout><APropos /></PublicLayout>} />
            <Route path="/equipe" element={<PublicLayout><Equipe /></PublicLayout>} />
            <Route path="/galerie" element={<PublicLayout><Galerie /></PublicLayout>} />
            <Route path="/videos" element={<PublicLayout><Videos /></PublicLayout>} />
            <Route path="/evenements" element={<PublicLayout><Evenements /></PublicLayout>} />
            <Route path="/partenaires" element={<PublicLayout><Partenaires /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="events" element={<AdminEvents />} />
                      <Route path="team" element={<AdminTeam />} />
                      <Route path="gallery" element={<AdminGallery />} />
                      <Route path="videos" element={<AdminVideos />} />
                      <Route path="content" element={<AdminContent />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="dashboard" element={<AdminEvents />} />
                      <Route path="" element={<AdminEvents />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
      </SiteContentProvider>
    </AuthProvider>
  );
}

export default App;