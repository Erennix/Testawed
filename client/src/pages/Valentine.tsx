import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useConfig, useCreateResponse } from "@/hooks/use-responses";
import { HeartBackground } from "@/components/HeartBackground";
import { Loader2, Heart } from "lucide-react";

export default function Valentine() {
  const [location, setLocation] = useLocation();
  const [name, setName] = useState("");
  const { data: config, isLoading: isConfigLoading } = useConfig();
  const { mutate: createResponse, isPending } = useCreateResponse();

  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get name from storage on mount
  useEffect(() => {
    const storedName = localStorage.getItem("valentineName");
    if (!storedName) {
      setLocation("/");
      return;
    }
    setName(storedName);
  }, [setLocation]);

  const handleNoInteraction = () => {
    setNoCount(prev => prev + 1);
    
    // Calculate random position within viewport, but keep it somewhat centered
    // to prevent it from going off-screen or being unreachable
    const x = (Math.random() - 0.5) * 500; // -250 to 250 px offset
    const y = (Math.random() - 0.5) * 500;
    
    setNoPosition({ x, y });
  };

  const handleYes = () => {
    setAccepted(true);
    createResponse({ name, accepted: true });
    
    // Celebration effect
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Phrases for the No button
  const getNoButtonText = () => {
    const phrases = [
      "No",
      "Are you sure?",
      "Really sure?",
      "Think again!",
      "Last chance!",
      "Surely not?",
      "You might regret this!",
      "Give it another thought!",
      "Are you absolutely certain?",
      "This could be a mistake!",
      "Have a heart!",
      "Don't be so cold!",
      "Change of heart?",
      "Wouldn't you reconsider?",
      "Is that your final answer?",
      "You're breaking my heart ;(",
    ];
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  // Calculate Yes button scale based on No clicks
  // Cap at a reasonable size so it doesn't break everything immediately
  const yesScale = 1 + (noCount * 0.15); 
  
  if (isConfigLoading || !name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" ref={containerRef}>
      <HeartBackground />
      
      <AnimatePresence mode="wait">
        {accepted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10 p-8 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-primary/20 shadow-2xl max-w-lg w-full"
          >
            <div className="mb-6 relative inline-block">
              <Heart className="w-32 h-32 text-primary fill-primary animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">🥰</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl mb-4 text-primary font-bold">Yay!!!</h1>
            <p className="text-2xl text-muted-foreground font-hand">
              I knew you'd say yes, {name}! ❤️
            </p>
            <div className="mt-8 text-sm text-muted-foreground">
              (I love you!!!)
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center max-w-4xl w-full z-10"
          >
            {/* Main Content Card */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-12 shadow-xl border border-white/50 w-full flex flex-col items-center mb-8">
              {/* Image/GIF */}
              <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white mb-8 w-full max-w-sm aspect-square md:aspect-video bg-pink-100 relative">
                <img 
                  src={config?.gifUrl || "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODg3cWhmdjV5ZGgxbjJ4Zmh4cWN4Zmh4cWN4Zmh4cWN4Zmh4cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LMB3W502pI760/giphy.gif"} 
                  alt="Cute valentine gif"
                  className="w-full h-full object-cover"
                />
                {/* HTML Comment: Cute cat gif alternative if user provided one fails: https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODg3cWhmdjV5ZGgxbjJ4Zmh4cWN4Zmh4cWN4Zmh4cWN4Zmh4cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LMB3W502pI760/giphy.gif */}
              </div>

              {/* Question */}
              <h1 className="text-4xl md:text-6xl text-center text-primary mb-2 leading-tight">
                {name},
              </h1>
              <h2 className="text-3xl md:text-5xl text-center text-foreground font-bold mb-8">
                {config?.question || "Will you be my Valentine?"}
              </h2>
            </div>

            {/* Buttons Area - Absolute positioning tricks */}
            <div className="relative flex flex-wrap justify-center items-center gap-8 w-full h-32">
              <motion.button
                onClick={handleYes}
                whileHover={{ scale: yesScale + 0.1 }}
                whileTap={{ scale: yesScale - 0.1 }}
                animate={{ scale: yesScale }}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transition-colors z-20 min-w-[150px]"
              >
                Yes 💖
              </motion.button>

              <motion.button
                onMouseEnter={handleNoInteraction}
                onClick={handleNoInteraction}
                animate={{ 
                  x: noPosition.x, 
                  y: noPosition.y,
                  opacity: Math.max(0, 1 - (noCount * 0.1)), // Slowly fade out
                  scale: Math.max(0, 1 - (noCount * 0.1)),
                  display: noCount >= 10 ? "none" : "block"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold py-4 px-8 rounded-full text-xl shadow-md min-w-[150px] absolute md:static"
                style={{
                  position: noCount > 0 ? 'absolute' : 'relative'
                }}
              >
                {getNoButtonText()}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
