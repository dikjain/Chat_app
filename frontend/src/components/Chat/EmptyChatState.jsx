import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Step1ChatDemo from "./Step1ChatDemo";
import Step2ChatDemo from "./Step2ChatDemo";
import Step3ChatDemo from "./Step3ChatDemo";
import Step4ChatDemo from "./Step4ChatDemo";

const EmptyChatState = ({ isAuthPage }) => {
  const containerRef = useRef(null);
  const boxRefs = useRef({});
  const [lines, setLines] = useState([]);

  const stepFeatures = [
    {
      id: 1,
      title: "Search & Connect",
      description: "Find users by name or email to start conversations",
      gradient: "bg-[radial-gradient(circle,_#3b82f6,_#60a5fa,_#93c5fd,_#bfdbfe,_transparent,transparent)]",
      position: { top: "2%", left: "0%", width: "42%", height: "36%", transform: "scale(0.85)" }
    },
    {
      id: 2,
      title: "Browse Chats",
      description: "Navigate through your conversations and group chats",
      gradient: "bg-[radial-gradient(circle,_#fb923c,_#fdba74,_#fed7aa,_#ffedd5,_transparent,transparent)]",
      position: { top: "4%", left: "50%", width: "50%", height: "40%", transform: "scale(0.95)" }
    },
    {
      id: 4,
      title: "Multilingual Translation",
      description: "Translate messages instantly between different languages",
      gradient: "bg-[radial-gradient(circle,_#a78bfa,_#c4b5fd,_#ddd6fe,_#ede9fe,_transparent,transparent)]",
      position: { top: "40%", left: "3%", width: "45%", height: "42%", transform: "scale(0.93)" }
    },
    {
      id: 3,
      title: "AI Message Assistant",
      description: "Get smart suggestions to complete and improve your messages",
      gradient: "bg-[radial-gradient(circle,_#34d399,_#6ee7b7,_#a7f3d0,_#d1fae5,_transparent,transparent)]",
      position: { top: "50%", left: "55%", width: "45%", height: "38%", transform: "scale(0.95)" }
    }
  ];

  useEffect(() => {
    const calculateLines = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLines = [];

      const connections = [
        { start: 1, end: 2, type: 'horizontal' },
        { start: 4, end: 3, type: 'horizontal' },
        { start: 1, end: 4, type: 'vertical' },
        { start: 2, end: 3, type: 'vertical' }
      ];

      connections.forEach(({ start, end, type }) => {
        const startEl = boxRefs.current[start];
        const endEl = boxRefs.current[end];

        if (startEl && endEl) {
          const startRect = startEl.getBoundingClientRect();
          const endRect = endEl.getBoundingClientRect();

          if (type === 'horizontal') {
            const startX = startRect.right - containerRect.left;
            const startY = startRect.top + startRect.height / 2 - containerRect.top;
            const endX = endRect.left - containerRect.left;
            const endY = endRect.top + endRect.height / 2 - containerRect.top;

            const midX = (startX + endX) / 2;

            [-10, -6, -2, 2, 6, 10].forEach((offset, index) => {
              newLines.push({
                d: `M ${startX} ${startY + offset} L ${midX + (-index * 4)} ${startY + offset} L ${midX + (-index * 4)} ${endY + offset} L ${endX} ${endY + offset}`,
                type: 'horizontal'
              });
            });
          } else {
            const startX = startRect.left + startRect.width / 2 - containerRect.left;
            const startY = startRect.bottom - containerRect.top;
            const endX = endRect.left + endRect.width / 2 - containerRect.left;
            const endY = endRect.top - containerRect.top;

            const midY = (startY + endY) / 2;

            [-10, -6, -2, 2, 6, 10].forEach((offset, index) => {
              newLines.push({
                d: `M ${startX + offset} ${startY} L ${startX + offset} ${midY + (-index * 4)} L ${endX + offset} ${midY + (-index * 4)} L ${endX + offset} ${endY}`,
                type: 'vertical'
              });
            });
          }
        }
      });
      setLines(newLines);
    };

    calculateLines();
    window.addEventListener('resize', calculateLines);
    // Recalculate after a short delay to ensure layout is settled
    const timeout = setTimeout(calculateLines, 100);

    return () => {
      window.removeEventListener('resize', calculateLines);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full p-4">
      <svg className="absolute inset-0 pointer-events-none z-0 overflow-visible">
        {lines.map((line, i) => (
          <path key={i} d={line.d} stroke="rgba(0,0,0,0.1)" strokeWidth="1" fill="none" />
        ))}
      </svg>
      {stepFeatures.map((step) => (
        <div
          key={step.id}
          ref={el => boxRefs.current[step.id] = el}
          style={step.position}
          className="absolute p-3 border border-neutral-200 rounded-xl overflow-hidden"
        >
          <div
            className={`group h-full w-full rounded-lg p-3 flex flex-col gap-2 overflow-hidden ${isAuthPage ? "bg-white shadow-md  border border-neutral-200" : ""}`}
          >
            {!isAuthPage && <div className={`w-full avs z-0 h-full scale-75 ease-out group-hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-80 translate-y-1/2 absolute bottom-0 left-1/2 ${step.gradient} blur-[64px]`}></div>}
            <div className="mb-3 flex-shrink-0 relative z-10">
              <p className="text-lg font-saira font-medium text-neutral-600">
                {step.title}
              </p>
              <p className="text-sm text-neutral-400 ">
                {step.description}
              </p>
            </div>
            <div className="relative z-10">
              {step.id === 1 && <Step1ChatDemo />}
              {step.id === 2 && <Step2ChatDemo />}
              {step.id === 3 && <Step3ChatDemo />}
              {step.id === 4 && <Step4ChatDemo />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmptyChatState;
