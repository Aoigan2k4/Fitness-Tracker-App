import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    x: 50,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -50,
  },
};

const pageTransition = {
  duration: 0.5,
  ease: "easeInOut",
};

export default function PageWrapper({ children }) {
  return (
    <motion.div
      className="auth-fullscreen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}
