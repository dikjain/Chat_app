import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ChatState } from '@/context/Chatprovider';
import axios from 'axios';

function LanguageModal({children}) {
  const { user, setUser, primaryColor } = ChatState();
  const [isOpen, setIsOpen] = useState(false);
  const languages = ['Hindi', 'English', 'Spanish', 'French', 'German', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali'];
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Added state for loading

  useEffect(() => {
    if(user.TranslateLanguage){
      setSelectedLanguage(user.TranslateLanguage);
    } else {
      setSelectedLanguage("English");
    }
  }, [user.TranslateLanguage]);

  const handleLanguageChange = async () => {
    setIsLoading(true); // Start loading
    if(user.TranslateLanguage !== selectedLanguage){
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.post("/api/user/updatelanguage", {
          UserId: user._id,
          language: selectedLanguage,
        }, config);
        setUser({ ...user, TranslateLanguage: selectedLanguage });
        setIsOpen(false);
        localStorage.setItem("userInfo", JSON.stringify({ ...user, TranslateLanguage: selectedLanguage }))
      } catch (err) {
        toast.error("Error Occured!", {
          description: err.response.data.message,
        });
      }
    }
    setIsLoading(false); // Stop loading
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-black text-[#10b981] overflow-hidden max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Your Language</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center">
          <select 
            className="w-full mt-2 mb-2 font-['Orbitron'] text-black rounded-md px-3 py-2"
            style={{ backgroundColor: primaryColor }}
            value={selectedLanguage || ""} 
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="">Select language</option>
            {languages.map((language) => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
          {isLoading && <Spinner className="mt-2" />}
        </div>
        <DialogFooter className="flex justify-between">
          <Button 
            className="mr-3" 
            style={{ backgroundColor: primaryColor, color: "white" }}
            onClick={handleLanguageChange}
            disabled={isLoading}
          >
            {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
            Submit
          </Button>
          <Button className="mr-3 bg-red-600 hover:bg-red-700 text-white" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>  )
}

export default LanguageModal