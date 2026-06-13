import { useRef, useCallback, useEffect } from 'react';

export function useLongPress(callback: (e: any) => void, delay = 500) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentTargetRef = useRef<EventTarget | null>(null);

  const start = useCallback((e: any) => {
    currentTargetRef.current = e.currentTarget;

    timer.current = setTimeout(() => {
      callback({
        ...e,
        currentTarget: currentTargetRef.current,
      });
    }, delay);
  }, [callback, delay]);

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: cancel,
    onTouchCancel: cancel,
  };
}