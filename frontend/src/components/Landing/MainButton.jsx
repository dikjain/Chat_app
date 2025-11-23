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
            className={`px-3 w-fit py-1 font-saira font-medium text-white rounded-md bg-gradient-to-t from-green-600 to-green-400 shadow-[-2px_2px_6px_0px_#4ade8070,-8px_8px_16px_0px_#4ade8070,-16px_16px_32px_0px_#4ade8070,inset_0px_1px_4px_1px_#ffffff90] drop-shadow-[0px_1px_0px_#00000040] ${className}`}>
            {children}
        </motion.button>
    );
};