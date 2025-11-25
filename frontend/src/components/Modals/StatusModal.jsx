import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { useAuthStore } from "@/stores";
import { useCreateStatus } from "@/hooks/mutations/useStatusMutations";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";
import TabSlider from "@/components/UI/TabSlider";
import ViewStatusModal from './ViewStatusModal';
import { Upload } from "lucide-react";
import { motion } from 'framer-motion';

function StatusModal({ children }) {
  const user = useAuthStore((state) => state.user);
  const createStatusMutation = useCreateStatus();
  const { uploadImage } = useCloudinaryUpload();

  const [isOpen, setIsOpen] = useState(false);
  const [statusContent, setStatusContent] = useState({ text: "", imageUrl: "" });
  const [activeTab, setActiveTab] = useState("Create Status");

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
    if (statusContent.text === "" && statusContent.imageUrl === "") {
      toast.warning("Please Enter Some Text or Upload an Image!");
      return;
    }

    if (statusContent.text.length > 200) {
      toast.warning("Maximum 200 characters allowed!");
      return;
    }

    createStatusMutation.mutate(
      {
        userId: user._id,
        content: statusContent.text,
        mediaUrl: statusContent.imageUrl,
      },
      {
        onSuccess: () => {
          setStatusContent({ text: "", imageUrl: "" });
        },
      }
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild onClick={() => setIsOpen(true)}>
          {children}
        </DialogTrigger>
        <DialogContent className="bg-white  max-w-md border-neutral-200 overflow-hidden  h-[95vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-neutral-800 mb-4">Update Your Status</DialogTitle>
            <div className="w-full max-w-fit mx-auto">
              <TabSlider
                tabs={["Create Status", "My Status"]}
                onTabChange={setActiveTab}
                defaultTab={activeTab}
              />
            </div>
          </DialogHeader>
          <div className="flex  flex-col w-full  h-full  ">
            {activeTab === "Create Status" ? (
              <div className="flex-1 flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-neutral-800">Add New Status</h3>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-sm text-neutral-600 mb-2">Upload an image</p>
                  <div
                    onClick={takeImage}
                    className="relative flex flex-col justify-center items-center p-6 rounded-lg cursor-pointer h-[40vh] bg-neutral-50 hover:bg-neutral-200 transition-colors border-2 border-dashed border-neutral-300 hover:border-neutral-400"
                    style={{ boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' }}
                  >
                    {statusContent.imageUrl ? (
                      <img src={statusContent.imageUrl} className="absolute inset-0 w-full h-full object-cover rounded-lg" alt="Status Image" />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 text-neutral-500">
                        <Upload className="h-8 w-8" />
                        <p className="text-sm font-medium">Click to upload image</p>
                      </div>
                    )}
                  </div>
                </div>
                <textarea
                  placeholder="What's on your mind?"
                  className="w-full p-3 bg-white border border-neutral-300 rounded-lg placeholder:text-neutral-400 resize-none text-neutral-800 focus:outline-none"
                  rows={3}
                  value={statusContent.text}
                  onChange={(e) => setStatusContent((prev) => ({ ...prev, text: e.target.value }))}
                />
                <motion.button
                  onClick={CreateStatus}
                  disabled={createStatusMutation.isPending}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ backgroundImage: "linear-gradient(to top, #16a34a, #22c55e)" }}
                  transition={{ duration: 0.1 }}
                  className="px-6 w-fit py-2.5 font-medium text-white rounded-lg bg-gradient-to-t from-green-600 ml-auto to-green-400 shadow-[-2px_2px_6px_0px_#4ade8070,inset_0px_1px_4px_1px_#ffffff90] drop-shadow-[0px_1px_0px_#00000040] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createStatusMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="mr-2 h-4 w-4" />
                      Adding...
                    </div>
                  ) : (
                    "Add Status"
                  )}
                </motion.button>
              </div>
            ) : (
              <div className="h-full  w-full flex items-center justify-center">
                <ViewStatusModal
                  currUser={user}
                  user={user}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default StatusModal