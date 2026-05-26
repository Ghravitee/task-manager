import { useEffect, useRef } from "react";

interface Props {
  isLoading: boolean;
}

export function PageTransitionLoader({ isLoading }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const widthRef = useRef(0);

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const setWidth = (width: number, transition: string) => {
    if (!barRef.current) return;
    widthRef.current = width;
    barRef.current.style.width = `${width}%`;
    barRef.current.style.transition = transition;
  };

  const show = () => {
    if (!barRef.current) return;
    barRef.current.style.opacity = "1";
  };

  const hide = () => {
    if (!barRef.current) return;
    barRef.current.style.opacity = "0";
  };

  useEffect(() => {
    if (isLoading) {
      clear();
      show();
      setWidth(30, "width 0.4s ease-out");

      intervalRef.current = setInterval(() => {
        const current = widthRef.current;
        if (current >= 85) {
          clearInterval(intervalRef.current!);
          return;
        }
        const remaining = 85 - current;
        setWidth(current + remaining * 0.08, "width 0.4s ease-out");
      }, 150);
    } else {
      clear();
      setWidth(100, "width 0.2s ease-out");

      timeoutRef.current = setTimeout(() => {
        hide();
        timeoutRef.current = setTimeout(() => {
          setWidth(0, "none");
        }, 300);
      }, 300);
    }

    return clear;
  }, [isLoading]);

  return (
    <div
      ref={barRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: "0%",
        opacity: 0,
        zIndex: 9999,
        background: "#22d3ee",
        boxShadow: "0 0 8px #22d3ee, 0 0 4px #22d3ee66",
        transition: "width 0.4s ease-out",
      }}
    />
  );
}
