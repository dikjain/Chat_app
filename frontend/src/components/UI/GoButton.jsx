import { motion } from "framer-motion";

function GoButton({ onClick, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="bg-white hover:bg-neutral-50 p-1 px-3 z-10 flex items-center justify-center relative rounded-md font-medium font-saira text-sm text-neutral-600 shadow-[0_1px_2px_0_rgba(0,0,0,0.2)] transition-colors"
      {...props}
    >
      Go
    </motion.button>
  );
}

export default GoButton;

