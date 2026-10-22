"use client";

import { useEffect, useState } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { formatCurrency } from "@/lib/format";

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 90,
    damping: 20,
    mass: 0.8,
  });
  const [display, setDisplay] = useState(() => formatCurrency(0));

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplay(formatCurrency(latest));
  });

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return (
    <span className={className}>
      {shouldReduceMotion ? formatCurrency(value) : display}
    </span>
  );
}
