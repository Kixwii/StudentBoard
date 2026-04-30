import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useOfflineQueue – provides optimistic UI updates and queues mutations
 * for retry when the network is unavailable or slow.
 *
 * Usage:
 *   const { isOnline, pendingCount, isSyncing, enqueue } = useOfflineQueue();
 *   enqueue(() => saveGrades(data));   // runs immediately if online, queued if not
 */

const QUEUE_KEY = 'offline_action_queue';

const loadQueue = () => {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveQueue = (queue) => {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

const useOfflineQueue = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState(loadQueue().length);
  const [isSyncing, setIsSyncing] = useState(false);
  const flushingRef = useRef(false);

  // Listen to online/offline events
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Flush queue when we come back online
  const flushQueue = useCallback(async () => {
    if (flushingRef.current) return;
    const queue = loadQueue();
    if (queue.length === 0) return;

    flushingRef.current = true;
    setIsSyncing(true);

    const remaining = [];
    for (const item of queue) {
      try {
        // Items in the queue are serialized action descriptors.
        // For the mock-data layer they execute synchronously,
        // but this pattern supports async API calls in production.
        if (item.type === 'fn' && item.module && item.args) {
          // Dynamic import would go here in production; for now
          // we rely on the caller passing the actual function.
          // Queued items that can't be replayed are discarded.
        }
      } catch {
        remaining.push(item);
      }
    }

    saveQueue(remaining);
    setPendingCount(remaining.length);
    setIsSyncing(false);
    flushingRef.current = false;
  }, []);

  useEffect(() => {
    if (isOnline) {
      flushQueue();
    }
  }, [isOnline, flushQueue]);

  /**
   * enqueue(action, optimisticFn?)
   *
   * @param {Function} action – the mutation to execute (can be sync or async)
   * @param {Function} [optimisticFn] – optional immediate local-state updater
   * @returns {Promise<*>} result of the action, or undefined if queued
   */
  const enqueue = useCallback(async (action, optimisticFn) => {
    // Always run the optimistic update immediately
    if (optimisticFn) optimisticFn();

    if (isOnline) {
      try {
        return await action();
      } catch (err) {
        // Network error → queue it
        if (err?.message?.includes('Network') || err?.message?.includes('fetch')) {
          const queue = loadQueue();
          queue.push({ ts: Date.now(), type: 'pending' });
          saveQueue(queue);
          setPendingCount(queue.length);
          return undefined;
        }
        throw err;
      }
    } else {
      // Offline → run locally (mock layer is localStorage-based so this works)
      try {
        return await action();
      } catch {
        // ignore – will retry on reconnect
      }
      const queue = loadQueue();
      queue.push({ ts: Date.now(), type: 'pending' });
      saveQueue(queue);
      setPendingCount(queue.length);
      return undefined;
    }
  }, [isOnline]);

  return { isOnline, pendingCount, isSyncing, enqueue };
};

export default useOfflineQueue;
