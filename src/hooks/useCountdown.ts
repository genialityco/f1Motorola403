import { useCallback, useEffect, useRef, useState } from 'react';

type UseCountdownOptions = {
  durationMilliseconds: number;
  onExpire?: () => void;
};

export function useCountdown({ durationMilliseconds, onExpire }: UseCountdownOptions) {
  const [remainingMilliseconds, setRemainingMilliseconds] = useState(durationMilliseconds);
  const requestIdRef = useRef<number | null>(null);
  const deadlineRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const stop = useCallback(() => {
    runningRef.current = false;

    if (requestIdRef.current !== null) {
      window.cancelAnimationFrame(requestIdRef.current);
      requestIdRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    deadlineRef.current = null;
    setRemainingMilliseconds(durationMilliseconds);
  }, [durationMilliseconds, stop]);

  const start = useCallback(() => {
    stop();

    const startTime = window.performance.now();
    deadlineRef.current = startTime + durationMilliseconds;
    runningRef.current = true;
    setRemainingMilliseconds(durationMilliseconds);

    const tick = () => {
      if (deadlineRef.current === null) {
        return;
      }

      const remaining = Math.max(0, deadlineRef.current - window.performance.now());
      setRemainingMilliseconds(remaining);

      if (remaining <= 0) {
        runningRef.current = false;
        requestIdRef.current = null;
        onExpireRef.current?.();
        return;
      }

      requestIdRef.current = window.requestAnimationFrame(tick);
    };

    requestIdRef.current = window.requestAnimationFrame(tick);
  }, [durationMilliseconds, stop]);

  useEffect(() => stop, [stop]);

  return {
    remainingMilliseconds,
    deadlineRef,
    runningRef,
    start,
    stop,
    reset,
    isRunning: runningRef.current
  };
}
