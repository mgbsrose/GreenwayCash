'use client';

import { useRef, useState } from 'react';
import type { CSSProperties, PointerEvent, ReactNode } from 'react';

type LongPressProps = {
  children: ReactNode;
  onTap?: () => void;
  onHold: () => void;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

/**
 * Touch/mouse button with distinct short-tap and long-press actions.
 *
 * Moving the pointer more than 14 px cancels the gesture to avoid accidental
 * input while scrolling. The long-press action fires only once per gesture.
 */
export function LongPress({
  children,
  onTap,
  onHold,
  delay = 600,
  className = '',
  style,
  title,
}: LongPressProps) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);
  const start = useRef<[number, number]>([0, 0]);
  const [holding, setHolding] = useState(false);

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  };

  const down = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    fired.current = false;
    start.current = [event.clientX, event.clientY];
    setHolding(true);

    timer.current = setTimeout(() => {
      fired.current = true;
      timer.current = null;
      setHolding(false);
      onHold();
    }, delay);
  };

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const distance = Math.hypot(
      event.clientX - start.current[0],
      event.clientY - start.current[1],
    );

    if (distance > 14) {
      cancel();
      fired.current = true;
    }
  };

  const up = () => {
    const shouldTap = timer.current !== null && !fired.current;
    cancel();
    if (shouldTap) onTap?.();
  };

  return (
    <button
      type="button"
      title={title}
      className={`${className} ${holding ? 'holding' : ''}`}
      style={style}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={cancel}
      onContextMenu={(event) => event.preventDefault()}
    >
      {children}
    </button>
  );
}
