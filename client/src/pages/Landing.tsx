import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { HeartBackground } from "@/components/HeartBackground";

export default function Landing() {
  const [name, setName] = useState("");
  const [, setLocation] = useLocation();
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(true);
      return;
    }
    // Save to localStorage so we can retrieve it in the next page without complex state management
    localStorage.setItem("valentineName", name.trim());
    setLocation("/valentine");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <HeartBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl shadow-primary/10 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-rose-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
            <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
          </div>

          <h1 className="text-4xl mb-2 text-primary">Hello there!</h1>
          <p className="text-muted-foreground mb-8 font-medium">
            I have a very special question for you...
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(false);
                }}
                placeholder="What's your name?"
                className={`
                  w-full px-5 py-4 rounded-xl bg-white border-2 
                  outline-none transition-all duration-300 text-lg font-medium text-center
                  placeholder:text-muted-foreground/60
                  ${error 
                    ? "border-destructive/50 focus:border-destructive focus:ring-4 focus:ring-destructive/10" 
                    : "border-pink-100 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  }
                `}
                autoFocus
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, translateY: -1 }}
              whileTap={{ scale: 0.98 }}
              className="
                w-full py-4 rounded-xl font-bold text-lg text-white
                bg-gradient-to-r from-primary to-rose-500
                shadow-lg shadow-primary/25
                hover:shadow-xl hover:shadow-primary/40
                transition-all duration-300
                flex items-center justify-center gap-2
              "
            >
              Continue <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
