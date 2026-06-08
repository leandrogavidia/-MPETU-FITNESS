import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ParticleType {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  color: string;
  shape: "circle" | "square" | "triangle";
  delay: number;
}

const SHAPES: ("circle" | "square" | "triangle")[] = ["circle", "square", "triangle"];
const COLORS = [
  "#14f195", // Solana Green
  "#9945ff", // Solana Purple
  "#00f0ff", // Solana Neon Blue
  "#ff007a", // Magic Neon Pink
  "#ffdd00", // High Contrast Gold/Yellow
];

export function Confetti() {
  const [particles, setParticles] = useState<ParticleType[]>([]);

  useEffect(() => {
    // Generate 120 particles bursting from center with varying trajectories and physics
    const generated: ParticleType[] = Array.from({ length: 120 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 380; // wide spreading radius
      
      const targetX = Math.cos(angle) * distance;
      // Subtract gravity bias so pieces fall slightly
      const targetY = Math.sin(angle) * distance + 140; 

      return {
        id: i,
        x: targetX,
        y: targetY,
        scale: 0.4 + Math.random() * 0.8,
        rotate: Math.random() * 1080 - 540, // multirotational spins
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        delay: Math.random() * 0.2, // Staggered delays
      };
    });

    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {particles.map((p) => {
        const renderShape = () => {
          switch (p.shape) {
            case "circle":
              return (
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                  style={{ backgroundColor: p.color, color: p.color }}
                />
              );
            case "triangle":
              return (
                <div
                  className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                  style={{ borderBottomColor: p.color }}
                />
              );
            default: // square / diamond
              return (
                <div
                  className="w-2.5 h-2.5 rotate-45 shadow-[0_0_6px_currentColor]"
                  style={{ backgroundColor: p.color, color: p.color }}
                />
              );
          }
        };

        return (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: [1, 1, 0.7, 0],
              scale: p.scale,
              rotate: p.rotate,
            }}
            transition={{
              duration: 2.5,
              ease: [0.1, 0.8, 0.3, 1], // Custom fast initial ease followed by slow decay
              delay: p.delay,
            }}
            className="absolute"
          >
            {renderShape()}
          </motion.div>
        );
      })}
    </div>
  );
}
