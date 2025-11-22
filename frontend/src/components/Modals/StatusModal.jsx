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
import { useState } from "react";
import { ChatState } from "@/context/Chatprovider";
import axios from 'axios';
import '@/styles/swiper.css';
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';
import ViewStatusModal from './ViewStatusModal';

function StatusModal({children}) {
  const { user, primaryColor } = ChatState();
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { uploadImage } = useCloudinaryUpload();

  const [isOpen, setIsOpen] = useState(false);
  const [statusContent, setStatusContent] = useState({ text: "", imageUrl: "" });
 


  const takeImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
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
    };
    input.click();
  }
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
      const requestConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post("/api/status", {
        id: user._id,
        content: statusContent.text,
        mediaUrl: statusContent.imageUrl,
      }, requestConfig);
      setStatusContent({ text: "", imageUrl: "" });
      // Fetch the updated status
      fetchStatus({id: user._id});
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Error Occured!");
      setIsLoading(false);
    }
  }

  const fetchStatus = async ({id}) => {
    try {

      const { data } = await axios.post("/api/status/fetch",{
        id: id
      });
      setStatus(data);
    } catch (err) {
      console.log(err);
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
            <ViewStatusModal setStatus={setStatus} currUser={user} fetchStatus={fetchStatus} status={status.status} user={user}/>

            {/* Right side: Add new status */}
            <div className="flex-1 ml-0 md:ml-2">
              <h3 className="text-xl font-semibold mb-4" style={{ color: primaryColor }}>Add New Status</h3>
              <div>
                <p style={{ color: primaryColor }}>Upload an image</p>
                <div 
                  onClick={takeImage} 
                  className="flex justify-center items-center p-2 rounded-md cursor-pointer"
                  style={{ backgroundColor: primaryColor, height: "30vh", color: "black" }}
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
                className="w-full mt-3 p-2 bg-black border border-[#10b981] rounded-md placeholder:text-gray-500 resize-none"
                style={{ color: "#10b981", maxHeight: "100px" }}
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