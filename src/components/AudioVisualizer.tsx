
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AudioVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const barWidth = 4;
    const barGap = 2;
    const barCount = Math.floor(canvas.width / (barWidth + barGap));
    const barHeightMultiplier = canvas.height * 0.5;
    
    const bars: number[] = Array(barCount).fill(0);
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isPlaying) {
        // Animate bars with a pseudo-random pattern for visualization
        for (let i = 0; i < bars.length; i++) {
          // Simulate audio reactivity with simple math
          bars[i] = Math.sin(Date.now() * 0.001 + i * 0.2) * 0.5 + 0.5;
          
          // Add some randomness
          bars[i] *= 0.8 + Math.random() * 0.2;
          
          const barHeight = bars[i] * barHeightMultiplier;
          const x = i * (barWidth + barGap);
          const y = canvas.height - barHeight;
          
          const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
          gradient.addColorStop(0, "#9b87f5");
          gradient.addColorStop(1, "#6E59A5");
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      } else {
        // Draw a flat line when not playing
        const y = canvas.height - 2;
        ctx.fillStyle = "#9b87f540";
        ctx.fillRect(0, y, canvas.width, 2);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);
  
  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={40}
      className={cn("w-full h-10", className)}
    />
  );
};
