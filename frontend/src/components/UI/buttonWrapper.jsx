import { motion } from "framer-motion";
import React from "react";
import { cn } from "../../lib/utils";


const ButtonWrapper = React.forwardRef(({ children, className, onClick, scaleDown = 0.97, ...props }, ref) => {
    return (
        <span 
          ref={ref}
          className={cn("bg-black/10 text-neutral-500 rounded-lg overflow-hidden p-1 flex items-center justify-center relative w-fit shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.3)] cursor-pointer", className)}
          {...props}>
            <motion.span
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: scaleDown }}
              transition={{ duration: 0.3 }}
              onClick={onClick}
              className="flex items-center justify-center size-full"
            >
              {children}
            </motion.span>
        </span>
    );
});

ButtonWrapper.displayName = "ButtonWrapper";

export default ButtonWrapper;