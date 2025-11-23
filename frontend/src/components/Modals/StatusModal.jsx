import React,{useEffect} from 'react'
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
import { useState, useRef } from "react";
import { useAuthStore } from "@/stores";
import { createStatus, fetchStatus } from "@/api";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';
import ViewStatusModal from './ViewStatusModal';

function StatusModal({children}) {
  const user = useAuthStore((state) => state.user);
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { uploadImage } = useCloudinaryUpload();

  const [isOpen, setIsOpen] = useState(false);
  const [statusContent, setStatusContent] = useState({ text: "", imageUrl: "" });
 


  const fileInputRef = useRef(null);

  const takeImage = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imgUrl = await uploadImage(file);
      if (imgUrl) {
        setStatusContent((prev) => ({
          ...prev,
          imageUrl: imgUrl,
        }));
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const CreateStatus = async () => {

    if(statusContent.text === "" && statusContent.imageUrl === ""){
      toast.warning("Please Enter Some Text or Upload an Image!");
      return;
    }

    if(statusContent.text.length > 200){
      toast.warning("Maximum 200 characters allowed!");
      return;
    }
    setIsLoading(true);
    try {
      await createStatus(user._id, statusContent.text, statusContent.imageUrl);
      setStatusContent({ text: "", imageUrl: "" });
      // Fetch the updated status
      handleFetchStatus(user._id);
      setIsLoading(false);
    } catch (err) {
      // Error handling is done by interceptor
      setIsLoading(false);
    }
  }

  const handleFetchStatus = async (id) => {
    try {
      const data = await fetchStatus(id);
      setStatus(data);
    } catch (err) {
      // Error handling is done by interceptor
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild onClick={() => setIsOpen(true)}>
          {children}
        </DialogTrigger>
        <DialogContent className="bg-black text-[#10b981] overflow-hidden max-w-[95vw] h-[95vh]">
          <DialogHeader>
            <DialogTitle>Update Your Status</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row w-full h-full">
            {/* Left side: Display current status */}
            <ViewStatusModal setStatus={setStatus} currUser={user} fetchStatus={handleFetchStatus} status={status.status} user={user}/>

            {/* Right side: Add new status */}
            <div className="flex-1 ml-0 md:ml-2">
              <h3 className="text-xl font-semibold mb-4" style={{ color: "#10b981" }}>Add New Status</h3>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p style={{ color: "#10b981" }}>Upload an image</p>
                <div 
                  onClick={takeImage} 
                  className="flex justify-center items-center p-2 rounded-md cursor-pointer h-[30vh] text-black"
                  style={{ backgroundColor: "#10b981" }}
                >
                    {statusContent.imageUrl ? (
                      <img src={statusContent.imageUrl} className="object-cover h-full" alt="Status Image" />
                    ) : (
                      <p>No image uploaded</p>
                    )}
                </div>
              </div>
              <textarea
                placeholder="What's on your mind?"
                className="w-full mt-3 p-2 bg-black border border-[#10b981] rounded-md placeholder:text-gray-500 resize-none text-[#10b981] max-h-[100px]"
                value={statusContent.text}
                onChange={(e) => setStatusContent((prev) => ({ ...prev, text: e.target.value }))}
              />
              <Button className="bg-green-600 hover:bg-green-700 mt-3" onClick={CreateStatus} disabled={isLoading}>
                {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                Add
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button className="bg-green-600 hover:bg-green-700 mr-3" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default StatusModal