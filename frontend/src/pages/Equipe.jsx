import React from 'react';
import { motion } from 'framer-motion';
import { getTeamMembers } from '../api/api';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { Card, CardContent } from '../components/ui/card';

export const Equipe = () => {
  const { data: team, loading: isLoading } = useRealtimeData(getTeamMembers, 'team');

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
              Notre Équipe
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Rencontrez les artistes passionnés qui font vivre notre crew
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1B6D] mx-auto"></div>
            </div>
          ) : team && team.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative h-80">
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-[#FF1B6D] font-medium mb-3">{member.role}</p>
                      {member.bio && (
                        <p className="text-gray-600 text-sm">{member.bio}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">L'équipe sera bientôt présentée</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};