import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from './useNotifications';

interface RealTimeUpdate {
  type: 'create' | 'update' | 'delete';
  module: string;
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  timestamp: Date;
  data?: any;
}

export const useRealTimeUpdates = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { addNotification } = useNotifications();

  // Simulate WebSocket connection
  useEffect(() => {
    // In a real app, this would be a WebSocket connection
    const interval = setInterval(() => {
      setIsConnected(true);
      setLastUpdate(new Date());
    }, 30000); // Heartbeat every 30 seconds

    setIsConnected(true);
    return () => clearInterval(interval);
  }, []);

  const broadcastUpdate = useCallback((update: Omit<RealTimeUpdate, 'timestamp'>) => {
    const fullUpdate: RealTimeUpdate = {
      ...update,
      timestamp: new Date()
    };

    // In a real app, this would send to WebSocket server
    console.log('Broadcasting update:', fullUpdate);

    // Simulate receiving the update for other users
    setTimeout(() => {
      handleIncomingUpdate(fullUpdate);
    }, 100);

    setLastUpdate(new Date());
  }, []);

  const handleIncomingUpdate = useCallback((update: RealTimeUpdate) => {
    // Don't show notifications for current user's actions
    if (update.userId === 'current-user') return;

    const actionText = {
      create: 'creó',
      update: 'actualizó',
      delete: 'eliminó'
    }[update.type];

    addNotification({
      userId: update.userId,
      type: 'info',
      title: 'Actualización en tiempo real',
      message: `${update.userName} ${actionText} ${update.entityName} en ${update.module}`,
      actionUrl: `/${update.module}/${update.entityId}`
    });
  }, [addNotification]);

  return {
    isConnected,
    lastUpdate,
    broadcastUpdate
  };
};