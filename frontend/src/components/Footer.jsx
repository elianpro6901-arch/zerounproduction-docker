import React from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';

export const Footer = () => {
  const content = useSiteContent();
  return (
    <footer id="contact" className="bg-black py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-black text-[#FF1B6D] mb-2">
              zerounproduction
            </h3>
            <p className="text-gray-400 text-sm">
              {content?.footerTagline || 'Cultures Urbaines – Événements – Expositions'}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-gray-500 text-xs">
            <span>© 2025 Breakdance Crew. Tous droits réservés.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};