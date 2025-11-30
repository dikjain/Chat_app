import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "react-chat-elements";
import { SendHorizontal as Send, Check } from "lucide-react";
import cursorSvg from "/cursor.svg";

const Step3ChatDemo = () => {
  const [message, setMessage] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [animationStep, setAnimationStep] = useState(0);
  const [sentMessage, setSentMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const inputRef = useRef(null);
  const sendButtonRef = useRef(null);
  const suggestionBarRef = useRef(null);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Mock messages and AI suggestions
  const demoMessages = [
    {
      initial: "Hey, how are",
      aiSuggestion: "Hey, how are you doing today?",
      final: "Hey, how are you doing today?"
    },
    {
      initial: "Can you help",
      aiSuggestion: "Can you help me with this task?",
      final: "Can you help me with this task?"
    },
    {
      initial: "What time is",
      aiSuggestion: "What time is the meeting scheduled?",
      final: "What time is the meeting scheduled?"
    }
  ];

  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);

  // Position cursor at input
  const positionCursorAtInput = () => {
    if (!inputRef.current || !containerRef.current) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setCursorPosition({
      top: inputRect.top - containerRect.top + inputRect.height / 2 - 14,
      left: inputRect.right - containerRect.left - 30,
    });
  };

  // Move cursor to suggestion bar
  const moveCursorToSuggestion = () => {
    if (!suggestionBarRef.current || !containerRef.current) return;

    const barRect = suggestionBarRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setCursorPosition({
      top: barRect.top - containerRect.top + barRect.height / 2 - 14,
      left: barRect.left - containerRect.left + barRect.width / 2 - 14,
    });
  };

  // Move cursor to send button
  const moveCursorToSendButton = () => {
    if (!sendButtonRef.current || !containerRef.current) return;

    const buttonRect = sendButtonRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setCursorPosition({
      top: buttonRect.top - containerRect.top + buttonRect.height / 2 - 14,
      left: buttonRect.left - containerRect.left + buttonRect.width / 2 - 14,
    });
  };

  // Type text with animation
  const typeText = (textToType, callback) => {
    let currentIndex = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (currentIndex < textToType.length) {
        setMessage(textToType.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (callback) callback();
      }
    }, 80);
  };

  // Show AI suggestion with typing effect
  const showAISuggestion = (suggestion, callback) => {
    let currentIndex = 0;
    setAiSuggestion("");
    setDisplayText("");
    setIsRemoving(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (currentIndex < suggestion.length) {
        const newText = suggestion.slice(0, currentIndex + 1);
        setAiSuggestion(newText);
        setDisplayText(newText);
        currentIndex++;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (callback) callback();
      }
    }, 30);
  };

  // Clear message with backspace effect
  const clearMessage = (callback) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let callbackCalled = false;
    intervalRef.current = setInterval(() => {
      setMessage((prevText) => {
        if (prevText.length > 0) {
          return prevText.slice(0, -1);
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (callback && !callbackCalled) {
            callbackCalled = true;
            callback();
          }
          return prevText;
        }
      });
    }, 50);
  };

  // Clear AI suggestion with animation
  const clearAISuggestion = (callback) => {
    setIsRemoving(true);
    const textLength = displayText.length;
    const timer = setTimeout(() => {
      setDisplayText("");
      setAiSuggestion("");
      setIsRemoving(false);
      if (callback) callback();
    }, textLength * 10 + 100);

    return () => clearTimeout(timer);
  };

  // Main animation sequence
  const startAnimationSequence = (demoIndex) => {
    const currentDemo = demoMessages[demoIndex];

    // Step 1: Position cursor at input
    setAnimationStep(1);
    positionCursorAtInput();

    timeoutRef.current = setTimeout(() => {
      // Step 2: Type initial message
      setAnimationStep(2);
      typeText(currentDemo.initial, () => {
        timeoutRef.current = setTimeout(() => {
          // Step 3: Show AI suggestion
          setAnimationStep(3);
          showAISuggestion(currentDemo.aiSuggestion, () => {
            timeoutRef.current = setTimeout(() => {
              // Step 4: Move cursor to suggestion bar
              setAnimationStep(4);
              moveCursorToSuggestion();

              timeoutRef.current = setTimeout(() => {
                // Step 5: Click suggestion (update message)
                setAnimationStep(5);
                setMessage(currentDemo.final);
                clearAISuggestion();

                timeoutRef.current = setTimeout(() => {
                  // Step 6: Move cursor to send button
                  setAnimationStep(6);
                  moveCursorToSendButton();

                  timeoutRef.current = setTimeout(() => {
                    // Step 7: Click send (simulate sending)
                    setAnimationStep(7);
                    setIsSending(true);
                    // Show the message as sent
                    setSentMessage(currentDemo.final);

                    timeoutRef.current = setTimeout(() => {
                      // Clear input but keep sent message visible
                      setMessage("");
                      setAiSuggestion("");
                      setDisplayText("");
                      setIsSending(false);

                      timeoutRef.current = setTimeout(() => {
                        // Step 8: Clear sent message and reset
                        setAnimationStep(8);
                        setSentMessage("");
                        positionCursorAtInput();

                        const nextIndex = (demoIndex + 1) % demoMessages.length;
                        setCurrentDemoIndex(nextIndex);

                        timeoutRef.current = setTimeout(() => {
                          startAnimationSequence(nextIndex);
                        }, 800);
                      }, 1500);
                    }, 800);
                  }, 600);
                }, 600);
              }, 600);
            }, 1500);
          });
        }, 500);
      });
    }, 500);
  };

  // Start animation on mount
  useEffect(() => {
    positionCursorAtInput();

    timeoutRef.current = setTimeout(() => {
      startAnimationSequence(0);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Get textarea element from react-chat-elements Input
  const getTextarea = () => {
    if (!inputRef.current) return null;
    return inputRef.current.tagName === 'TEXTAREA' || inputRef.current.tagName === 'INPUT'
      ? inputRef.current
      : inputRef.current.querySelector('textarea') || inputRef.current.querySelector('input');
  };

  // Update textarea value
  useEffect(() => {
    const textarea = getTextarea();
    if (textarea && textarea.value !== message) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set ||
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      if (setter) {
        setter.call(textarea, message);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }, [message]);

  const rightButtons = (
    <button
      ref={sendButtonRef}
      className={`h-8 w-8  flex items-center justify-center rounded-full transition-all duration-300 ${isSending
        ? "bg-green-500 shadow-[inset_0_1px_3px_0_rgba(255,255,255,0.8),0_1px_2px_0_rgba(0,0,0,0.3)]"
        : "bg-neutral-600 shadow-[inset_0_1px_3px_0_rgba(255,255,255,0.8),0_1px_2px_0_rgba(0,0,0,0.3)]"
        }`}
      aria-label="Send Message"
      disabled={!message.trim()}
    >
      {isSending ? (
        <Check className="h-4 w-4 text-white" />
      ) : (
        <Send className="h-4 w-4 text-white" />
      )}
    </button>
  );

  const isAuthPage = window.location.href.includes("/auth");

  return (
    <div ref={containerRef} className="flex   flex-col  px-2 py-1 relative">
      {/* Sent Message Display */}
      <AnimatePresence>
        {sentMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mb-2 flex justify-end"
          >
            <div className="max-w-[80%] bg-blue-500 text-white rounded-lg px-4 py-2 shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-sm">{sentMessage}</span>
                <Check className="h-3 w-3 flex-shrink-0" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2)" }}
        className={`flex flex-col ${isAuthPage ? "mx-0" : "mx-6"} items-center mb-1 relative border rounded-lg overflow-hidden h-full bg-gr-5`}
      >
        {/* React Chat Elements Input */}
        <div className="w-full bg-white">
          <Input
            referance={inputRef}
            placeholder="Enter a message.."
            value={message}
            onChange={() => { }}
            multiline={true}
            autoHeight={true}
            minHeight={25}
            maxHeight={120}
            rightButtons={rightButtons}
            inputStyle={{
              padding: "8px 12px",
              fontSize: "14px",
              lineHeight: "1.4",
            }}
            readOnly
          />
        </div>

        {/* AI Suggestion Bar (simplified MessageActionBar) */}
        <div className="relative py-1 w-full focus:outline-none outline-none bg-white shadow-sm">
          <div className="relative flex items-center ml-2 rounded-md pr-4">
            <div
              ref={suggestionBarRef}
              style={{ boxShadow: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.1)' }}
              className="text-sm w-full px-2 pr-16 bg-neutral-100 rounded-md text-neutral-400 cursor-pointer min-h-[28px] flex items-center"
            >
              <AnimatePresence mode='popLayout'>
                {displayText ? (
                  <motion.div
                    key="text"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="truncate whitespace-nowrap overflow-hidden"
                  >
                    {displayText.split("").map((char, index) => (
                      <motion.span
                        key={`${displayText}-${index}`}
                        initial={{ opacity: 1, y: 0, scale: 1 }}
                        animate={
                          isRemoving
                            ? { opacity: 0, y: -4, scale: 0.8 }
                            : { opacity: 1, y: 0, scale: 1 }
                        }
                        transition={{
                          delay: isRemoving ? index * 0.003 : 0,
                          duration: 0.2,
                          ease: "easeInOut"
                        }}
                        style={{ display: "inline-block" }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </motion.div>
                ) : (
                  <motion.span
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-neutral-400"
                  >
                    AI suggestion will appear here...
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div
              style={{
                boxShadow:
                  "inset 0 1.5px 3px 0 rgba(255, 255, 255, 0.5), 0 2px 3px 0 rgba(0, 0, 0, 0.2)",
              }}
              className="absolute bg-white rounded-sm h-fit px-1 right-5 top-1/2 -translate-y-1/2 text-xs flex items-center text-neutral-500 font-medium border border-neutral-200"
            >
              Tab
              <img
                src="https://static.thenounproject.com/png/enter-icon-3552033-512.png"
                alt="enter icon"
                width="18"
                height="18"
                fetchPriority="high"
                className="object-contain opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animated Cursor */}
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

export default Step3ChatDemo;

