import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import GoButton from "@/components/UI/GoButton";
import UserListItem from "@/components/UI/UserListItem";
import ChatLoading from "@/components/Chat/ChatLoading";
import cursorSvg from "/cursor.svg";

const Step1ChatDemo = () => {
  const [searchText, setSearchText] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Mock users data - two profiles
  const mockUsers = [
    {
      _id: "demo-user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      pic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    {
      _id: "demo-user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      pic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
    }
  ];

  // Position cursor at input
  const positionCursorAtInput = () => {
    if (!inputRef.current || !containerRef.current) return;
    
    const inputRect = inputRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    setCursorPosition({
      top: inputRect.top - containerRect.top + inputRect.height / 2 - 14,
      left: inputRect.right - containerRect.left - 20,
    });
  };

  // Move cursor to button position
  const moveCursorToButton = () => {
    if (!buttonRef.current || !containerRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setCursorPosition({
      top: buttonRect.top - containerRect.top + buttonRect.height / 2 - 14,
      left: buttonRect.left - containerRect.left + buttonRect.width / 2 - 14,
    });
  };

  // Clear search text with backspace effect
  const clearSearchText = (callback) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    let callbackCalled = false;
    intervalRef.current = setInterval(() => {
      setSearchText((prevText) => {
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

  // Type text with animation
  const typeText = (textToType, callback) => {
    let currentIndex = 0;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (currentIndex < textToType.length) {
        setSearchText(textToType.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (callback) callback();
      }
    }, 100);
  };

  // Main animation sequence for a user
  const startAnimationSequence = (userIndex) => {
    const currentUser = mockUsers[userIndex];
    const textToType = currentUser.name;

    // Position cursor at input first
    positionCursorAtInput();

    // Type the user's name
    typeText(textToType, () => {
      // After typing, move cursor to button
      timeoutRef.current = setTimeout(() => {
        moveCursorToButton();
        
        // After cursor reaches button, click it and show loading
        timeoutRef.current = setTimeout(() => {
          setIsLoading(true);
          
          // After 1 second of loading, show user
          timeoutRef.current = setTimeout(() => {
            setIsLoading(false);
            setShowUser(true);
            setCurrentUserIndex(userIndex);
            
            // After showing user for 2 seconds, clear and move to next
            timeoutRef.current = setTimeout(() => {
              setShowUser(false);
              // Move cursor back to input
              positionCursorAtInput();
              
              // Clear search text
              clearSearchText(() => {
                // Move to next user (loop back to first after last)
                const nextIndex = (userIndex + 1) % mockUsers.length;
                
                // Start animation for the next user after a brief delay
                timeoutRef.current = setTimeout(() => {
                  startAnimationSequence(nextIndex);
                }, 500);
              });
            }, 2000);
          }, 1000);
        }, 800);
      }, 500);
    });
  };

  // Start animation on mount
  useEffect(() => {
    // Initial cursor position at input
    positionCursorAtInput();
    
    // Start with first user after a brief delay
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

  return (
    <div ref={containerRef} className="flex  px-8 flex-col gap-2 h-full relative">
      <div className="flex gap-2 pb-2 flex-shrink-0">
        <Input
          ref={inputRef}
          placeholder="Search by name or email"
          className="bg-white border-neutral-300 placeholder:text-neutral-400 text-neutral-500"
          value={searchText}
          readOnly
        />
        <div ref={buttonRef} className="flex items-center justify-center">
          <GoButton onClick={() => {}} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <ChatLoading />
        ) : showUser ? (
          <div className="space-y-2">
            <UserListItem
              user={mockUsers[currentUserIndex]}
              handleFunction={() => {}}
            />
          </div>
        ) : null}
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

export default Step1ChatDemo;

