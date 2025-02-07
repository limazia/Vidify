import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export function AnimatePresence({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <motion.div
      key={location && location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
