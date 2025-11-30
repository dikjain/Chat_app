import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { Spinner } from "@/components/UI/spinner";
import { useAuthStore } from '@/stores';
import { useUpdateUserLanguage } from "@/hooks/mutations/useUserMutations";

function LanguageModal({children}) {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [isOpen, setIsOpen] = useState(false);
  const languages = ['Hindi', 'English', 'Spanish', 'French', 'German', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali'];
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const updateUserLanguageMutation = useUpdateUserLanguage();

  useEffect(() => {
    if(user.TranslateLanguage){
      setSelectedLanguage(user.TranslateLanguage);
    } else {
      setSelectedLanguage("English");
    }
  }, [user.TranslateLanguage]);

  const handleLanguageChange = () => {
    if(user.TranslateLanguage !== selectedLanguage){
      updateUserLanguageMutation.mutate(
        { userId: user._id, language: selectedLanguage },
        {
          onSuccess: () => {
            updateUser({ TranslateLanguage: selectedLanguage });
            setIsOpen(false);
          },
        }
      );
    }
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
            style={{ backgroundColor: "#10b981" }}
            value={selectedLanguage || ""} 
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="">Select language</option>
            {languages.map((language) => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
          {updateUserLanguageMutation.isPending && <Spinner className="mt-2" />}
        </div>
        <DialogFooter className="flex justify-between">
          <Button 
            className="mr-3" 
            style={{ backgroundColor: "#10b981", color: "white" }}
            onClick={handleLanguageChange}
            disabled={updateUserLanguageMutation.isPending}
          >
            {updateUserLanguageMutation.isPending ? <Spinner className="mr-2 h-4 w-4" /> : null}
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