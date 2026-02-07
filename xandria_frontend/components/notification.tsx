"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/stores/useStore";

export default function NotificationContainer() {
  const { notifications, dismissNotification } = useStore();
  const latest = notifications[notifications.length - 1];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]">
      <AnimatePresence>
        {latest && (
          <motion.div
            key={latest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-surface border border-border rounded-lg px-5 py-3 shadow-[var(--shadow-card)] flex items-center gap-3 min-w-[280px]"
            onClick={() => dismissNotification(latest.id)}
          >
            <div className="w-[2px] h-8 bg-accent rounded-full flex-shrink-0" />
            <div>
              <p className="text-text-primary text-sm font-body">
                {latest.title}
              </p>
              <p className="text-text-muted text-xs">
                {latest.subtitle}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
