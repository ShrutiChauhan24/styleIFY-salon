import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const text = [
  { letter: "S", color: "text-white" },
  { letter: "t", color: "text-white" },
  { letter: "y", color: "text-white" },
  { letter: "l", color: "text-white" },
  { letter: "e", color: "text-white" },
  { letter: "I", color: "text-pink-500" },
  { letter: "F", color: "text-pink-500" },
  { letter: "Y", color: "text-pink-500" },
];

export default function Loader({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);

      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, 1700);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#111111]"
        >
          <div className="flex flex-col items-center">

            {/* Logo Text */}
            <div
              className="
                flex
                font-black
                italic
                tracking-tight
                leading-none
                select-none
                text-[42px]
                sm:text-[56px]
                md:text-[70px]
                lg:text-[82px]
              "
            >
              {text.map((item, index) => (
                <motion.span
                  key={index}
                  className={item.color}
                  initial={{
                    opacity: 0,
                    y: 25,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    delay: index * 0.09,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {item.letter}
                </motion.span>
              ))}
            </div>

            {/* Loading Line */}
            <div className="mt-7 h-[2px] w-24 overflow-hidden rounded-full bg-white/10 sm:w-32 md:w-40">
              <motion.div
                className="h-full bg-pink-500"
                initial={{ x: "-100%" }}
                animate={{ x: "120%" }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                  delay: 0.25,
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}