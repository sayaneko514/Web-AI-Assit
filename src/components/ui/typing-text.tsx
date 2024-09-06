"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
  theme = "light",
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
  theme?: "light" | "dark"; 
}) => {
  // Split text inside of words into an array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  // Calculate the total delay time for all characters to be typed out
  const totalTypingDelay =
    wordsArray.reduce((total, word) => total + word.text.length * 0.05, 0) +
    wordsArray.length * 0.65;

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content",
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        }
      );
    }
  }, [isInView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => (
          <div key={`word-${idx}`} className="inline-block">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: idx * 0.4,
                ease: "easeInOut",
              }}
              className={cn(
                theme === "dark" ? "text-zinc-200" : "text-zinc-900", // Manual theme override
                word.className
              )}
            >
              {word.text.map((char, index) => (
                <motion.span
                  key={`char-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.05,
                    delay: index * 0.05, // Typing effect
                    ease: "easeInOut",
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
            &nbsp;
          </div>
        ))}
      </motion.div>
    );
  };

  return (
    <div
      className={cn(
        "text-5xl font-extrabold text-center",
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          delay: totalTypingDelay, // Delay the cursor animation until typing is done
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "bg-[#6228d7] inline-block rounded-sm w-[4px] h-6 slim:h-5 max:h-6 pad:h-12 sm:h-9 lg:h-14",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};
