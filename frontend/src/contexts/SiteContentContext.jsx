import React, { createContext, useContext } from 'react';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { getSiteContent } from '../api/api';

const SiteContentContext = createContext(null);

export const useSiteContent = () => useContext(SiteContentContext);

export const SiteContentProvider = ({ children }) => {
  const { data: content } = useRealtimeData(getSiteContent, 'content');
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
};
