
import React, { useEffect, useState } from "react";
import { Quote } from "@/types";
import { cn } from "@/lib/utils";

interface QuoteOverlayProps {
  quote: Quote | null;
  show: boolean;
  className?: string;
}

export const QuoteOverlay: React.FC<QuoteOverlayProps> = ({
  quote,
  show,
  className,
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (show) {
      setAnimate(true);
    } else {
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!quote) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center pointer-events-none z-50 transition-opacity duration-500",
        show ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <div
        className={cn(
          "bg-black/60 backdrop-blur-sm p-6 rounded-lg max-w-lg text-center border border-primary/30",
          animate ? "animate-slide-in" : ""
        )}
      >
        <p className="text-white font-pixel text-xl mb-4">"{quote.text}"</p>
        <p className="text-gray-300 font-pixel">— {quote.author}</p>
      </div>
    </div>
  );
};
