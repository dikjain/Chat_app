import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import cursorSvg from "/cursor.svg";

const Step4ChatDemo = () => {
  const [messages, setMessages] = useState([
    { id: 0, text: "Hello, how are you?", original: "Hello, how are you?", translated: "Bonjour, comment allez-vous?", isCurrentUser: true, maxWidth: "70%" },
    { id: 1, text: "こんにちは、元気ですか？", original: "こんにちは、元気ですか？", translated: "Hola, ¿cómo estás?", isCurrentUser: false, maxWidth: "65%" },
    { id: 2, text: "Guten Tag, wie geht es dir?", original: "Guten Tag, wie geht es dir?", translated: "Good day, how are you?", isCurrentUser: true, maxWidth: "75%" }
  ]);
  
  const [translatingIndex, setTranslatingIndex] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const messageRefs = useRef([]);
  const containerRef = useRef(null);
  const timeoutRefs = useRef([]);
  const messagesRef = useRef([
    { id: 0, text: "Hello, how are you?", original: "Hello, how are you?", translated: "Bonjour, comment allez-vous?", isCurrentUser: true, maxWidth: "70%" },
    { id: 1, text: "こんにちは、元気ですか？", original: "こんにちは、元気ですか？", translated: "Hola, ¿cómo estás?", isCurrentUser: false, maxWidth: "65%" },
    { id: 2, text: "Guten Tag, wie geht es dir?", original: "Guten Tag, wie geht es dir?", translated: "Good day, how are you?", isCurrentUser: true, maxWidth: "75%" }
  ]);

  // Translation sequence: 0->French, 1->Spanish, 2->English, then 0->English (back)
  const translationSequence = [
    { messageIndex: 0, targetLang: "French", delay: 2500 },
    { messageIndex: 1, targetLang: "Spanish", delay: 2500 },
    { messageIndex: 2, targetLang: "English", delay: 2500 },
    { messageIndex: 0, targetLang: "English", delay: 2500, isRevert: true }
  ];

  const updateCursorPosition = (messageIndex, isCurrentUser) => {
    const messageEl = messageRefs.current[messageIndex];
    const container = containerRef.current;
    if (!messageEl || !container) return;

    const rect = messageEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setCursorPosition({
      top: rect.top - containerRect.top + rect.height / 2 - 14,
      left: isCurrentUser 
        ? rect.right - containerRect.left - 20 
        : rect.left - containerRect.left + 20,
    });
  };

  const translateMessage = (messageIndex, isRevert = false) => {
    setTranslatingIndex(messageIndex);
    
    const timeoutId = setTimeout(() => {
      setMessages(prev => {
        const updated = [...prev];
        updated[messageIndex] = {
          ...updated[messageIndex],
          text: isRevert ? updated[messageIndex].original : updated[messageIndex].translated
        };
        messagesRef.current = updated;
        return updated;
      });
      setTranslatingIndex(null);
    }, 1000);
    
    timeoutRefs.current.push(timeoutId);
  };

  useEffect(() => {
    let stepIndex = 0;

    const executeStep = () => {
      if (stepIndex >= translationSequence.length) {
        stepIndex = 0;
        // Reset all messages to original and wait before restarting
        setMessages(prev => {
          const updated = prev.map(msg => ({ ...msg, text: msg.original }));
          messagesRef.current = updated;
          return updated;
        });
        const resetTimeout = setTimeout(() => {
          executeStep();
        }, 1000);
        timeoutRefs.current.push(resetTimeout);
        return;
      }

      const step = translationSequence[stepIndex];
      const isCurrentUser = messagesRef.current[step.messageIndex]?.isCurrentUser ?? false;

      // Move cursor to message (with small delay to ensure DOM is ready)
      setTimeout(() => {
        updateCursorPosition(step.messageIndex, isCurrentUser);
      }, 100);

      // Wait, then translate
      const timeout1 = setTimeout(() => {
        translateMessage(step.messageIndex, step.isRevert);
        
        // Move to next step
        const timeout2 = setTimeout(() => {
          stepIndex++;
          executeStep();
        }, step.delay);
        
        timeoutRefs.current.push(timeout2);
      }, 1000);
      
      timeoutRefs.current.push(timeout1);
    };

    // Initial delay before starting
    const initialTimeout = setTimeout(() => {
      executeStep();
    }, 500);
    
    timeoutRefs.current.push(initialTimeout);

    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current = [];
    };
  }, []);

  return (
    <div ref={containerRef} className="p-4 px-8  flex flex-col h-full relative">
      <div className="flex-1 flex flex-col justify-end gap-3 pb-4">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            ref={(el) => (messageRefs.current[idx] = el)}
            style={{ maxWidth: msg.maxWidth || "75%" }}
            className={`rounded-2xl border bg-white shadow-md ${
              idx === 0 ? "px-4 py-2.5" : idx === 1 ? "px-5 py-2" : "px-4 py-2"
            } ${
              msg.isCurrentUser 
                ? "ml-auto text-neutral-500 border-neutral-200" 
                : "ml-0 text-black border-neutral-100"
            }`}
          >
            <motion.span
              key={msg.text}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={idx === 1 ? "text-sm" : "text-base"}
            >
              {translatingIndex === idx ? "translating..." : msg.text}
            </motion.span>
          </div>
        ))}
      </div>

      <motion.div
        className="absolute pointer-events-none z-50"
        initial={false}
        animate={cursorPosition}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <img src={cursorSvg} alt="cursor" className="w-7 h-7" />
      </motion.div>
    </div>
  );
};

export default Step4ChatDemo;

