import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReduceMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (alive) setReduce(v);
    });
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduce,
    );
    return () => {
      alive = false;
      sub?.remove?.();
    };
  }, []);

  return reduce;
}
