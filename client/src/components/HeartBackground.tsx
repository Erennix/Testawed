import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function HeartBackground() {
  // Generate a few random hearts for background decoration
  const hearts = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 30 + 10,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-primary/10"
          initial={{ x: `${heart.x}vw`, y: "110vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.5, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
        >
          <Heart fill="currentColor" size={heart.size} />
        </motion.div>
      ))}
    </div>
  );
}
