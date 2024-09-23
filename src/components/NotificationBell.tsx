// src/components/NotificationBell.tsx
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { getNotifications } from '@/lib/notifications';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  read: boolean;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const fetchedNotifications = await getNotifications(user.uid);
        setNotifications(fetchedNotifications as Notification[]);
        setUnreadCount((fetchedNotifications as Notification[]).filter(n => !n.read).length);
      };
      fetchNotifications();
    }
  }, [user]);

  return (
    <div className="relative">
      <Bell className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
}