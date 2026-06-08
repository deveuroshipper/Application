import { notificationsStatusApiHandler } from "@/helper/Api";
import { create } from "zustand";

type NotificationStatusResponse = {
  unreadCount?: number;
  isView?: boolean;
};

interface NotificationState {
  unreadCount: number;
  isView: boolean;
  hasUnreadNotification: boolean;
  isLoading: boolean;
  setStatus: (status: NotificationStatusResponse) => void;
  fetchStatus: () => Promise<NotificationStatusResponse>;
  clearStatus: () => void;
}

const getHasUnreadNotification = (unreadCount: number, isView: boolean) =>
  isView && unreadCount > 0;

export const useNotificationStore = create<NotificationState>()((set) => ({
  unreadCount: 0,
  isView: false,
  hasUnreadNotification: false,
  isLoading: false,

  setStatus: (status) => {
    const unreadCount = Number(status?.unreadCount ?? 0);
    const isView = Boolean(status?.isView);

    set({
      unreadCount,
      isView,
      hasUnreadNotification: getHasUnreadNotification(unreadCount, isView),
    });
  },

  fetchStatus: async () => {
    set({ isLoading: true });
    try {
      const status = await notificationsStatusApiHandler();
      const unreadCount = Number(status?.unreadCount ?? 0);
      const isView = Boolean(status?.isView);

      set({
        unreadCount,
        isView,
        hasUnreadNotification: getHasUnreadNotification(unreadCount, isView),
      });

      return { unreadCount, isView };
    } finally {
      set({ isLoading: false });
    }
  },

  clearStatus: () => {
    set({
      unreadCount: 0,
      isView: false,
      hasUnreadNotification: false,
    });
  },
}));
