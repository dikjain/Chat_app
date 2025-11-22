import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import axios from "axios";
import { ChatState } from "@/context/Chatprovider";
import { useState } from "react";
import ViewStatusModal from "./ViewStatusModal";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";
import { updateUser } from "@/api/auth";

const ProfileModal = ({ children, profileUser }) => {
  const [isNaam, setisNaam] = useState(false);
  const [naam, setNaam] = useState("");
  const [isViewStatusModal, setIsViewStatusModal] = useState(false);

  const { user, setUser, primaryColor } = ChatState();
  if (!profileUser) profileUser = user;

  const [isOpen, setIsOpen] = useState(false);
  const { uploadImage, isUploading } = useCloudinaryUpload();

  const handleUpdate = () => {
    setNaam(user.name);
    setisNaam((prev) => !prev);
  };

  const handleNameChange = async () => {
    setisNaam(false);
    setNaam(user.name);
    try {
      const data = await updateUser(user._id, naam, user.pic, user.token);
      if (data) {
        setUser({
          ...user,
          name: naam,
        });
        localStorage.setItem("userInfo", JSON.stringify({
          ...user,
          name: naam,
        }));
        toast.success("Name Updated!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const changePic = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const imgUrl = await uploadImage(file);
        if (imgUrl) {
          try {
            await updateUser(user._id, user.name, imgUrl, user.token);
            setUser({
              ...user,
              pic: imgUrl,
            });
            localStorage.setItem("userInfo", JSON.stringify({
              ...user,
              pic: imgUrl,
            }));
            toast.success("Profile Picture Updated!");
          } catch (err) {
            console.log(err);
          }
        }
      }
    };
    input.click();
  };

  const [status, setStatus] = useState([]);

  const fetchStatus = async ({ id }) => {
    try {
      const { data } = await axios.post("/api/status/fetch", {
        id: id,
      });
      setStatus(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleViewStatus = () => {
    fetchStatus({ id: profileUser._id });
    setIsViewStatusModal(true); // Set to view status modal
  };

  const handleCloseModal = () => {
    setIsViewStatusModal(false); // Reset state when closing modal
    setStatus([])
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
            <Button variant="ghost" size="icon" className="flex">
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="h-[410px] bg-[#18191a] max-w-lg">
          <DialogHeader className="relative text-4xl font-['Roboto'] flex justify-center" style={{ color: primaryColor }}>
            <DialogTitle className="text-4xl">
              {!isNaam && profileUser && profileUser.name.toUpperCase()}
              {isNaam && (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="name"
                    className="bg-black text-xl font-bold mx-[10px] w-[50%] h-10 z-[1000]"
                    style={{ color: primaryColor }}
                    value={naam}
                    onChange={(e) => setNaam(e.target.value)}
                  />
                  <Button onClick={handleNameChange}>Done</Button>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-between">
            {isUploading ? (
              <Spinner className="h-12 w-12" style={{ color: primaryColor }} />
            ) : (
              <img
                className="transition-all duration-300 rounded-full w-[150px] h-[150px]"
                style={{ border: `4px solid ${primaryColor}` }}
                src={profileUser && profileUser.pic}
                alt={profileUser && profileUser.name}
              />
            )}
            <p className="text-[28px] md:text-[30px]" style={{ color: primaryColor }}>
              {profileUser && `Email: ${profileUser.email}`}
            </p>
          </div>
          <DialogFooter className="w-full flex justify-between">
            {profileUser && user._id === profileUser._id && (
              <>
                <Button
                  className="my-1 text-[15px] rounded-[10px] font-bold"
                  style={{ backgroundColor: primaryColor, color: "white" }}
                  onClick={changePic}
                >
                  Change Picture
                </Button>
                <Button
                  className="my-1 text-[15px] rounded-[10px] font-bold"
                  style={{ backgroundColor: primaryColor, color: "white" }}
                  onClick={handleUpdate}
                >
                  Edit Name
                </Button>
              </>
            )}
            {profileUser && user._id !== profileUser._id && (
              <Button
                className="my-1 text-[15px] rounded-[10px] font-bold"
                style={{ backgroundColor: primaryColor, color: "white" }}
                onClick={handleViewStatus}
              >
                View Status
              </Button>
            )}
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Conditionally render ViewStatusModal content based on state */}
      {isViewStatusModal && (
        <Dialog open={isViewStatusModal} onOpenChange={handleCloseModal}>
          <DialogContent className="bg-black border-2 rounded-[10px] max-w-4xl" style={{ color: primaryColor, borderColor: primaryColor }}>
            <ViewStatusModal
              currUser={user}
              isOpen={isViewStatusModal}
              onClose={handleCloseModal}
              setStatus={setStatus}
              fetchStatus={fetchStatus}
              status={status.status}
              user={profileUser}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProfileModal;
