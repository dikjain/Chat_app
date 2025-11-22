import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const MainButton = ({ children, className }) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate('/auth');
    };

    return (    
        <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.96 }}
        whileHover={{ backgroundImage: "linear-gradient(to top, #16a34a, #22c55e)" }}
        transition={{ duration: 0.1 }}
            style={{boxShadow : "-2px 2px 6px 0px #4ade8070, -8px 8px 16px 0px #4ade8070, -16px 16px 32px 0px #4ade8070, inset 0px 1px 4px 1px #ffffff90 ", textShadow : "0px 1px 0px #00000040" }}
            className={`px-3 w-fit py-1 font-saira font-medium text-white rounded-md bg-gradient-to-t from-green-600 to-green-400 ${className}`}>
            {children}
        </motion.button>
    );
};