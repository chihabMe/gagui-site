"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import Image from "next/image";

interface WhatsAppFloatProps {
  phoneNumber: string;
  message?: string;
}

export function WhatsAppFloat({
  phoneNumber,
  message = "Bonjour, je suis intéressé par vos services de streaming TV",
}: WhatsAppFloatProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  // Track scroll direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const direction = latest > previous ? "down" : "up";

    // Show button after scrolling 300px down
    if (latest > 300 && direction === "down") {
      setIsVisible(true);
    } else if (latest < 300 || direction === "up") {
      setIsVisible(false);
    }
  });

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-shadow"
      initial={{ scale: 0, opacity: 0, y: 100 }}
      animate={
        isVisible
          ? {
              scale: 1,
              opacity: 1,
              y: 0,
            }
          : {
              scale: 0,
              opacity: 0,
              y: 100,
            }
      }
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.6,
      }}
      whileHover={{
        scale: 1.15,
        rotate: [0, -10, 10, -10, 0],
        transition: {
          rotate: {
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 3,
          },
          scale: {
            duration: 0.2,
          },
        },
      }}
      whileTap={{ scale: 0.9 }}
      aria-label="Contactez-nous sur WhatsApp"
    >
      {/* Icon with subtle bounce animation */}
      <motion.div
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <Image
          src="/whatsapp.png"
          alt="WhatsApp"
          width={40}
          height={40}
          className="w-10 h-10"
        />
      </motion.div>

      {/* Multiple pulse rings for more effect */}
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        initial={{ scale: 1, opacity: 0.4 }}
        animate={{ scale: 1.6, opacity: 0 }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeOut",
        }}
      />
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        initial={{ scale: 1, opacity: 0.3 }}
        animate={{ scale: 1.6, opacity: 0 }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeOut",
          delay: 1.25,
        }}
      />

      {/* Subtle glow effect */}
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366] blur-xl opacity-30"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
}
