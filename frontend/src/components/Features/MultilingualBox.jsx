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

export const WordBox = React.forwardRef(({ children, className = "", translateX = 0 }, ref) => (
  <span
    ref={ref}
    className={`bg-black/10 text-neutral-500 rounded-lg overflow-hidden p-1 flex items-center justify-center relative w-fit shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.3)] ${className}`}
    style={{ transform: `translateX(${translateX}px)` }}
  >
    <span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
      className="bg-white px-2 z-10 flex items-center justify-center py-0.5 relative rounded-md font-medium font-saira text-xs text-neutral-500 shadow-[0_1px_2px_0_rgba(0,0,0,0.3)]"
    >
      {children}
    </span>
  </span>
));
WordBox.displayName = "WordBox";

const EnglishBox = React.forwardRef(({ language }, ref) => (
  <span
    ref={ref}
    style={{ boxShadow: "inset 0 1px 2px 0 rgba(0, 0, 0, 0.3)" }}
    className="bg-black/10 text-neutral-500 rounded-lg overflow-hidden p-1 flex items-center justify-center relative"
  >
    <span
    
      style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.3)" }}
      className="bg-white px-2 z-10 flex items-center text-lg justify-center py-0.5 relative rounded-md font-medium font-saira"
    >
      {language ? language.charAt(0).toUpperCase() + language.slice(1) : "English"}
    </span>
  </span>
));
EnglishBox.displayName = "EnglishBox";

const RightWords = ({ words, wordRefs, language }) => (
  <div className="flex flex-col justify-center space-y-1.5 relative z-10">
    {words.map((word, index) => (
      <WordBox
        key={index}
        ref={(el) => (wordRefs.current[index] = el)}
        translateX={word.x ? -word.x : 0}
      >
        {word.translations[language] || word.english}
      </WordBox>
    ))}
  </div>
);

const ConnectionLines = ({ leftLines, rightLines, words }) => (
  <svg
    className="absolute inset-0 pointer-events-none z-0"
    style={{ overflow: 'visible' }}
  >
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      {[...leftLines, ...rightLines].map((_, index) => {
        const wordIndex = index < leftLines.length ? index : index - leftLines.length;
        const delay = words[wordIndex]?.delay || 0;
        return (
          <motion.linearGradient
            key={`gradient-${index}`}
            id={`gradient-${index}`}
            initial={{ x1: "0%", x2: "10%", y1: "0%", y2: "0%" }}
            animate={{ 
              x1: ["0%", "100%"], 
              x2: ["10%", "110%"], 
              y1: ["0%", "0%"], 
              y2: ["0%", "0%"] 
            }}
            transition={{ duration: 3, ease: "linear", repeat: Infinity, repeatType: "loop", delay }}
          >
            <stop stopColor="#10b981" stopOpacity="0" />
            <stop offset="30%" stopColor="#05df7230" stopOpacity="1" />
            <stop offset="50%" stopColor="#05df7260" stopOpacity="1" />
            <stop offset="70%" stopColor="#05df72" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </motion.linearGradient>
        );
      })}
    </defs>
    
    {leftLines.map((line, index) => (
      <path
        key={`left-${index}`}
        d={line.path}
        stroke="rgba(0, 0, 0, 0.2)"
        strokeWidth="1"
        fill="none"
      />
    ))}
    {rightLines.map((line, index) => (
      <path
        key={`right-${index}`}
        d={line.path}
        stroke="rgba(0, 0, 0, 0.2)"
        strokeWidth="1"
        fill="none"
      />
    ))}
    
    {leftLines.map((line, index) => (
      <motion.path
        key={`left-animated-${index}`}
        d={line.path}
        stroke={`url(#gradient-${index})`}
        strokeWidth="1"
        fill="none"
        strokeOpacity="1"
        filter="url(#glow)"
      />
    ))}
    {rightLines.map((line, index) => (
      <motion.path
        key={`right-animated-${index}`}
        d={line.path}
        stroke={`url(#gradient-${leftLines.length + index})`}
        strokeWidth="1"
        fill="none"
        strokeOpacity="1"
        filter="url(#glow)"
      />
    ))}
  </svg>
);

const Header = () => (
  <div className="flex items-center mb-4">
    <MultilingualIcon />
    <h1 className="text-base font-medium text-neutral-700">Multilingual</h1>
  </div>
);

const languages = ['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'arabic'];

const TransferBox = ({ className = "" }) => {
  const containerRef = useRef(null);
  const englishBoxRef = useRef(null);
  const wordRefs = useRef([]);
  const rightWordRefs = useRef([]);
  const [leftLines, setLeftLines] = useState([]);
  const [rightLines, setRightLines] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('spanish');

  const words = [
    { english: "Hello", x: 15, delay: 0.2, translations: { spanish: "Hola", french: "Bonjour", german: "Hallo", italian: "Ciao", portuguese: "Olá", japanese: "こんにちは", chinese: "你好", arabic: "مرحبا" } },
    { english: "Love", x: 3, delay: 0.8, translations: { spanish: "Amor", french: "Amour", german: "Liebe", italian: "Amore", portuguese: "Amor", japanese: "愛", chinese: "爱", arabic: "حب" } },
    { english: "Peace", x: 22, delay: 0.4, translations: { spanish: "Paz", french: "Paix", german: "Frieden", italian: "Pace", portuguese: "Paz", japanese: "平和", chinese: "和平", arabic: "سلام" } },
    { english: "Music", x: 7, delay: 1.1, translations: { spanish: "Música", french: "Musique", german: "Musik", italian: "Musica", portuguese: "Música", japanese: "音楽", chinese: "音乐", arabic: "موسيقى" } },
    { english: "Dream", x: 18, delay: 0.6, translations: { spanish: "Sueño", french: "Rêve", german: "Traum", italian: "Sogno", portuguese: "Sonho", japanese: "夢", chinese: "梦", arabic: "حلم" } },
    { english: "Hope", x: 11, delay: 0.9, translations: { spanish: "Esperanza", french: "Espoir", german: "Hoffnung", italian: "Speranza", portuguese: "Esperança", japanese: "希望", chinese: "希望", arabic: "أمل" } }
  ];

  useEffect(() => {
    const updateLines = () => {
      if (!containerRef.current || !englishBoxRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const englishRect = englishBoxRef.current.getBoundingClientRect();

      // Calculate left lines (from word boxes to English box)
      const newLeftLines = wordRefs.current
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
          
          // Create a smooth curve with control points
          const controlX1 = x1 + distance * 0.3;
          const controlX2 = x1 + distance * 0.7;
          const controlY1 = y1;
          const controlY2 = y2;
          
          // Create path string for cubic bezier curve
          const path = `M ${x1} ${y1} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x2} ${y2}`;
          
          return { path };
        });

      setLeftLines(newLeftLines);

      // Calculate right lines (from English box to right word boxes)
      const newRightLines = rightWordRefs.current
        .filter(ref => ref !== null)
        .map((wordRef) => {
          const wordRect = wordRef.getBoundingClientRect();
          
          // Right edge and vertical center of English box
          const x1 = englishRect.right - containerRect.left;
          const y1 = englishRect.top + englishRect.height / 2 - containerRect.top;
          
          // Left edge and vertical center of right word box
          const x2 = wordRect.left - containerRect.left;
          const y2 = wordRect.top + wordRect.height / 2 - containerRect.top;
          
          // Calculate distance for curve control points
          const distance = x2 - x1;
          
          // Create a smooth curve with control points
          const controlX1 = x1 + distance * 0.3;
          const controlX2 = x1 + distance * 0.7;
          const controlY1 = y1;
          const controlY2 = y2;
          
          // Create path string for cubic bezier curve
          const path = `M ${x1} ${y1} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x2} ${y2}`;
          
          return { path };
        });

      setRightLines(newRightLines);
    };

    updateLines();
    window.addEventListener('resize', updateLines);
    
    const timeout = setTimeout(updateLines, 100);

    return () => {
      window.removeEventListener('resize', updateLines);
      clearTimeout(timeout);
    };
  }, [currentLanguage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLanguage((prev) => {
        const currentIndex = languages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % languages.length;
        return languages[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`bg-neutral-50 border border-neutral-300 relative rounded-lg col-span-2 px-4 py-6 overflow-visible ${className}`}
    >
      <Header />
      
      <div className="flex items-center justify-between relative z-10 ">
        <div className="flex flex-col justify-center space-y-1.5">
          {words.map((word, index) => (
            <WordBox
              key={index}
              ref={(el) => (wordRefs.current[index] = el)}
              translateX={word.x || 0}
            >
              {word.english}
            </WordBox>
          ))}
        </div>
        
        <div 
        className="flex items-center justify-center  text-sm text-neutral-500 font-medium font-saira relative z-30">
          <EnglishBox ref={englishBoxRef} language={currentLanguage} />
        </div>

        <RightWords words={words} wordRefs={rightWordRefs} language={currentLanguage} />
      </div>
      
      <ConnectionLines leftLines={leftLines} rightLines={rightLines} words={words} />
    </div>
  );
};

export default TransferBox;
