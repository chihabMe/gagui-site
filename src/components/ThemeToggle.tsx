"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={toggleTheme}
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-full border border-primary/20 hover:border-accent/50 transition-all duration-300 bg-background/80 hover:bg-primary/10 dark:bg-background/80 dark:hover:bg-primary/10"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            initial={false}
            animate={{
              scale: theme === "light" ? 1 : 0,
              opacity: theme === "light" ? 1 : 0,
              rotate: theme === "light" ? 0 : 180,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute"
          >
            <Sun className="h-4 w-4 text-amber-500" />
          </motion.div>
          <motion.div
            initial={false}
            animate={{
              scale: theme === "dark" ? 1 : 0,
              opacity: theme === "dark" ? 1 : 0,
              rotate: theme === "dark" ? 0 : -180,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute"
          >
            <Moon className="h-4 w-4 text-blue-400" />
          </motion.div>
        </div>
      </Button>
    </motion.div>
  );
}
