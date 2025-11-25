import React from 'react';
import { motion } from 'framer-motion';
import { getVideos } from '../api/api';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { Play } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

export const Videos = () => {
  const { data: videos, loading: isLoading } = useRealtimeData(getVideos, 'videos');

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
              Vidéos
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Découvrez nos performances et moments forts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1B6D] mx-auto"></div>
            </div>
          ) : videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative aspect-video bg-black group cursor-pointer" onClick={() => window.open(video.videoUrl, '_blank')}>
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={video.videoUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-all">
                        <div className="w-16 h-16 bg-[#FF1B6D] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play size={28} className="text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-gray-600 text-sm">{video.description}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Les vidéos seront bientôt disponibles</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};