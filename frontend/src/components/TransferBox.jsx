import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const MultilingualIcon = () => (
  <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.5 3.5C8.63401 3.5 5.5 6.63401 5.5 10.5C5.5 14.366 8.63401 17.5 12.5 17.5C16.366 17.5 19.5 14.366 19.5 10.5C19.5 6.63401 16.366 3.5 12.5 3.5Z"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
    <path
      d="M2.5 10.5H22.5M12.5 2.5V18.5"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </svg>
);

const TransferBox = ({ className = "" }) => {
  const containerRef = useRef(null);
  const englishBoxRef = useRef(null);
  const wordRefs = useRef([]);
  const [lines, setLines] = useState([]);

  const words = [
    { english: "Hello", translations: { spanish: "Hola", french: "Bonjour", german: "Hallo", italian: "Ciao", portuguese: "Olá", japanese: "こんにちは", chinese: "你好", arabic: "مرحبا" } },
    { english: "Love", translations: { spanish: "Amor", french: "Amour", german: "Liebe", italian: "Amore", portuguese: "Amor", japanese: "愛", chinese: "爱", arabic: "حب" } },
    { english: "Peace", translations: { spanish: "Paz", french: "Paix", german: "Frieden", italian: "Pace", portuguese: "Paz", japanese: "平和", chinese: "和平", arabic: "سلام" } },
    { english: "Music", translations: { spanish: "Música", french: "Musique", german: "Musik", italian: "Musica", portuguese: "Música", japanese: "音楽", chinese: "音乐", arabic: "موسيقى" } },
    { english: "Dream", translations: { spanish: "Sueño", french: "Rêve", german: "Traum", italian: "Sogno", portuguese: "Sonho", japanese: "夢", chinese: "梦", arabic: "حلم" } },
    { english: "Hope", translations: { spanish: "Esperanza", french: "Espoir", german: "Hoffnung", italian: "Speranza", portuguese: "Esperança", japanese: "希望", chinese: "希望", arabic: "أمل" } }
  ];

  useEffect(() => {
    const updateLines = () => {
      if (!containerRef.current || !englishBoxRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const englishRect = englishBoxRef.current.getBoundingClientRect();

      const newLines = wordRefs.current
        .filter(ref => ref !== null)
        .map((wordRef) => {
          const wordRect = wordRef.getBoundingClientRect();
          
          // Right edge and vertical center of word box
          const x1 = wordRect.right - containerRect.left;
          const y1 = wordRect.top + wordRect.height / 2 - containerRect.top;
          
          // Left edge and vertical center of English box
          const x2 = englishRect.left - containerRect.left;
          const y2 = englishRect.top + englishRect.height / 2 - containerRect.top;
          
          // Calculate distance for curve control points
          const distance = x2 - x1;
          const midX = x1 + distance * 0.5;
          
          // Create a smooth curve with control points
          // Using cubic bezier curve for smooth S-shaped curve
          const controlX1 = x1 + distance * 0.3;
          const controlX2 = x1 + distance * 0.7;
          const controlY1 = y1;
          const controlY2 = y2;
          
          // Create path string for cubic bezier curve
          const path = `M ${x1} ${y1} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x2} ${y2}`;
          
          return { path };
        });

      setLines(newLines);
    };

    updateLines();
    window.addEventListener('resize', updateLines);
    
    // Small delay to ensure layout is complete
    const timeout = setTimeout(updateLines, 100);

    return () => {
      window.removeEventListener('resize', updateLines);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`bg-neutral-50 border border-neutral-300 relative rounded-lg col-span-2 px-4 py-6 overflow-visible ${className}`}>
      <div className="flex items-center mb-4">
        <MultilingualIcon />
        <h1 className="text-base font-medium text-neutral-700">Multilingual</h1>
      </div>
      
      <div className="flex flex-col justify-center space-y-1 relative z-10">
        {words.map((word, index) => (
          <div 
            key={index}
            ref={(el) => (wordRefs.current[index] = el)}
            className="text-sm border-2 border-neutral-300 bg-neutral-200 flex items-center justify-center text-neutral-500 font-medium font-saira rounded-lg w-fit px-2 py-1">
            {word.english}
          </div>
        ))}
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500 font-medium font-saira">
        <div className="flex items-center gap-2 relative z-10">
          <span 
            ref={englishBoxRef}
            style={{boxShadow : "inset 0 1px 2px 0 rgba(0, 0, 0, 0.3)"}}
            className="bg-black/10   text-neutral-500  rounded-lg  overflow-hidden p-1 flex items-center justify-center relative">
              <span
              style={{boxShadow : " 0 1px 2px 0 rgba(0, 0, 0, 0.3)"}}
               className=" bg-white px-2 z-10 flex items-center justify-center py-0.5  relative  rounded-md font-medium font-saira">
                  English
              </span>
                  <motion.div 
                  style={{
                    background : "green",
                    scale : 2 ,
                    filter : "blur(20px)"
                  }}
                  className="absolute size-[80%] ">
                  </motion.div>
              
          </span>
        </div>
      </div>
      
      {/* SVG Connection Lines */}
      <svg 
        className="absolute inset-0 pointer-events-none z-0"
        style={{ overflow: 'visible' }}
      >
        {lines.map((line, index) => (
          <path
            key={index}
            d={line.path}
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </svg>
    </div>
  );
};

export default TransferBox;
