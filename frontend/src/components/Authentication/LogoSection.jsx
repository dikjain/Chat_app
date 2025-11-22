import { motion } from "framer-motion";
import PixelBlast from "./PixelBlast";
import logo from "@/assets/logo.png";

const LogoSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(5px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(5px)" }}
      transition={{
        delay: 0.1,
        ease: "easeOut",
        duration: 0.1,
      }}
      className="flex items-center justify-center"
      style={{
        width: "100%",
        height: "200px",
        position: "absolute",
        top: 24,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <PixelBlast
        variant="circle"
        pixelSize={6}
        color="#f0f0f0"
        patternScale={3}
        patternDensity={2}
        pixelSizeJitter={0.5}
        speed={0.6}
        edgeFade={0.25}
        transparent
      />
      <motion.div
        initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        exit={{ y: 20, opacity: 0, filter: "blur(5px)" }}
        transition={{
          delay: 0.6,
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.4,
        }}
        style={{ boxShadow: "inset 0px 0px 4px  1px rgba(0,0,0,0.2)" }}
        className="flex items-center justify-center absolute bg-stone-100 p-1 rounded-md"
      >
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          exit={{ scale: 1.2 }}
          transition={{
            delay: 0.6,
          }}
          style={{ boxShadow: "0px 0px 4px 1px rgba(0,0,0,0.2)" }}
          className="bg-white border border-stone-100 flex items-center justify-center px-8 gap-1 rounded-sm"
        >
          <img src={logo} alt="logo" className="w-10 h-10" />
          <h1 className=" text-neutral-500 text-2xl font-medium font-saira pr-2">
            Chat-ly
          </h1>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LogoSection;

