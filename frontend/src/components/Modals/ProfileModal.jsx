import { Eye, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Spinner } from "@/components/UI/spinner";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";
import { useState, useRef, useEffect } from "react";
import { useUpdateUser, useUpdateUserLanguage } from "@/hooks/mutations/useUserMutations";
import ViewStatusModal from "./ViewStatusModal";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";

const ProfileModal = ({ children, profileUser }) => {
  const [isNaam, setisNaam] = useState(false);
  const [naam, setNaam] = useState("");
  const [isViewStatusModal, setIsViewStatusModal] = useState(false);

  const user = useAuthStore((state) => state.user);
  const updateUserStore = useAuthStore((state) => state.updateUser);
  if (!profileUser) profileUser = user;

  const [isOpen, setIsOpen] = useState(false);
  const { uploadImage, isUploading } = useCloudinaryUpload();
  
  const updateUserMutation = useUpdateUser();
  const updateUserLanguageMutation = useUpdateUserLanguage();
  
  // Language selection state (merged from LanguageModal)
  const languages = ['Hindi', 'English', 'Spanish', 'French', 'German', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali'];
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    if(user.TranslateLanguage){
      setSelectedLanguage(user.TranslateLanguage);
    } else {
      setSelectedLanguage("English");
    }
  }, [user.TranslateLanguage]);

  const handleNameEdit = () => {
    setNaam(user.name);
    setisNaam(true);
  };

  const handleNameChange = () => {
    setisNaam(false);
    updateUserMutation.mutate(
      { userId: user._id, name: naam, pic: user.pic },
      {
        onSuccess: () => {
          updateUserStore({ name: naam });
        },
      }
    );
  };

  const fileInputRef = useRef(null);

  const handleImageEdit = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLanguageChange = () => {
    if(user.TranslateLanguage !== selectedLanguage){
      updateUserLanguageMutation.mutate(
        { userId: user._id, language: selectedLanguage },
        {
          onSuccess: () => {
            updateUserStore({ TranslateLanguage: selectedLanguage });
          },
        }
      );
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imgUrl = await uploadImage(file);
      if (imgUrl) {
        updateUserMutation.mutate(
          { userId: user._id, name: user.name, pic: imgUrl },
          {
            onSuccess: () => {
              updateUserStore({ pic: imgUrl });
            },
          }
        );
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleViewStatus = () => {
    setIsViewStatusModal(true);
  };

  const handleCloseModal = () => {
    setIsViewStatusModal(false);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen && !isViewStatusModal} onOpenChange={setIsOpen}>
        {children ? (
          <DialogTrigger asChild onClick={() => setIsOpen(true)}>
            {children}
          </DialogTrigger>
        ) : (
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex bg-neutral-100 text-neutral-500 hover:text-neutral-600"
              aria-label="View user profile"
            >
              <Eye className="h-4 w-4 text-neutral-500" />
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="bg-neutral-200 border-neutral-200 max-w-lg z-[1001]">
          <DialogHeader className="relative flex justify-center">
            <DialogTitle className="text-2xl font-medium text-neutral-800 flex items-center gap-2">
              {!isNaam && profileUser && (
                <>
                  {profileUser.name.toUpperCase()}
                  {user._id === profileUser._id && (
                    <button
                      onClick={handleNameEdit}
                      className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
                      aria-label="Edit name"
                    >
                      <Pencil className="w-4 h-4 text-green-600" />
                    </button>
                  )}
                </>
              )}
              {isNaam && (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="name"
                    className="bg-white border-neutral-300 text-neutral-800 text-lg w-[60%] h-9"
                    value={naam}
                    onChange={(e) => setNaam(e.target.value)}
                  />
                  <Button 
                    onClick={handleNameChange}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Done
                  </Button>
                </div>
              )}
            </DialogTitle>
            <DialogDescription className="sr-only">
              User profile information and settings
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative">
              {isUploading ? (
                <Spinner className="h-12 w-12 text-green-600" />
              ) : (
                <>
                  <img
                  onClick={handleImageEdit}
                    className="transition-all duration-300 rounded-full w-[150px] h-[150px] border-4 border-green-600"
                    src={profileUser && profileUser.pic}
                    alt={profileUser && profileUser.name}
                  />
                  {user._id === profileUser._id && (
                    <button
                      onClick={handleImageEdit}
                      className="absolute bottom-0 right-0 p-2 bg-green-600 hover:bg-green-700 rounded-full text-white shadow-lg transition-colors"
                      aria-label="Edit profile picture"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
            <p className="text-lg text-neutral-600">
              {profileUser && `Email: ${profileUser.email}`}
            </p>
            {user._id === profileUser._id && (
              <div className="w-full mt-2">
                <label className="text-sm font-medium text-neutral-700 mb-2 block">Translation Language</label>
                <div className="flex items-center gap-2">
                  <select 
                    className="flex-1 border border-neutral-300 rounded-md px-3 py-2 text-neutral-800 bg-white"
                    value={selectedLanguage || ""} 
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    {languages.map((language) => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                  <Button 
                    onClick={handleLanguageChange}
                    disabled={updateUserLanguageMutation.isPending || user.TranslateLanguage === selectedLanguage}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {updateUserLanguageMutation.isPending ? <Spinner className="h-4 w-4" /> : "Update"}
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="w-full flex justify-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {profileUser && user._id !== profileUser._id && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleViewStatus}
              >
                View Status
              </Button>
            )}
            <Button 
              onClick={handleCloseModal}
              className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Conditionally render ViewStatusModal content based on state */}
      {isViewStatusModal && (
        <Dialog open={isViewStatusModal} onOpenChange={handleCloseModal}>
          <DialogContent className="bg-white border-neutral-200 max-w-4xl z-[1001]">
            <DialogDescription className="sr-only">
              View user status updates
            </DialogDescription>
            <ViewStatusModal
              currUser={user}
              user={profileUser}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProfileModal;
