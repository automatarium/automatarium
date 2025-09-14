import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./QuestionPager.module.css";

export type QuestionPagerProps = {
  value: number;              
  total: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function QuestionPager({
  value,
  total,
  onChange,
  disabled = false,
  className,
  id,
}: QuestionPagerProps) {
  const min = 1;
  const max = Math.max(1, total);

  const [text, setText] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(String(value));
  }, [value]);

  const canPrev = !disabled && value > min;
  const canNext = !disabled && value < max;

  const commit = (raw: string) => {
    const n = Number(raw);
    if (Number.isFinite(n)) {
      onChange(clamp(Math.trunc(n), min, max));
    } else {
      setText(String(value));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (canPrev) onChange(value - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (canNext) onChange(value + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      onChange(min);
    } else if (e.key === "End") {
      e.preventDefault();
      onChange(max);
    }
  };

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  return (
    <nav
      id={id}
      aria-label="Question navigation"
      className={clsx(styles.qpager, className)}   
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        className={styles.qpager__btn}              
        aria-label="Previous question"
        disabled={!canPrev}
        onClick={() => onChange(value - 1)}
      >
        ‹
      </button>

      <div className={styles.qpager__center}>      
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min={min}
          max={max}
          className={styles.qpager__input}         
          aria-label="Current question"
          value={text}
          disabled={disabled || total < 1}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commit((e.target as HTMLInputElement).value);
            }
          }}
        />
        <span className={styles.qpager__of}>of {total}</span> 
      </div>

      <button
        type="button"
        className={styles.qpager__btn}              
        aria-label="Next question"
        disabled={!canNext}
        onClick={() => onChange(value + 1)}
      >
        ›
      </button>
    </nav>
  );
}
