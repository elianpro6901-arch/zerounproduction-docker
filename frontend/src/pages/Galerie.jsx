import React from 'react';
import { motion } from 'framer-motion';
import { getGalleryItems } from '../api/api';
import { useRealtimeData } from '../hooks/useRealtimeData';

export const Galerie = () => {
  const { data: gallery, loading: isLoading } = useRealtimeData(getGalleryItems, 'gallery');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-black text-[#FF1B6D] mb-6">
              Galerie
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Nos meilleurs moments capturés en images
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1B6D] mx-auto"></div>
            </div>
          ) : gallery && gallery.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="relative group overflow-hidden rounded-lg aspect-square cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {item.title && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-white/80 text-sm">{item.description}</p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">La galerie sera bientôt disponible</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};