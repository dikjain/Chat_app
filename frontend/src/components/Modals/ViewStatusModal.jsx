import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import axios from 'axios';
import '@/styles/swiper.css';
import { ChatState } from "@/context/Chatprovider";

function ViewStatusModal({ fetchStatus, user, status, currUser }) {
  const { primaryColor } = ChatState();
  const [currentStatus, setCurrentStatus] = useState([]);

  const deleteStatus = async (id) => {
    try {
      await axios.post("/api/status/delete", { id: id });
      toast.success("Status deleted successfully");
      fetchStatus({ id: user._id });
    } catch (err) {
      console.log(err);
      toast.error("Error deleting status");
    }
  };

  const calculateTimeRemaining = (expiresAt) => {
    const diffInMs = new Date(expiresAt) - new Date();
    if (diffInMs <= 0) return 'Expired';
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `Expires in ${hours}h ${minutes}m` : `Expires in ${minutes}m`;
  };

  useEffect(() => {
    fetchStatus({ id: user._id });
  }, []);

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  return (
    <>
      <div className="flex-1 flex items-center justify-center mr-0 md:mr-2 mb-2 md:mb-0" id='swipercont'>
        <div className="w-full">
          <div className="flex items-center mb-4" style={{ color: primaryColor }}>
            <img 
              src={user.pic} 
              className="w-9 h-9 rounded-full mr-2" 
              style={{ border: `1px ${primaryColor} solid` }}
              alt={user.name}
            />
            <h3 className="text-xl font-semibold">
              {user._id === currUser._id ? "Your Status" : `${user.name}'s Status`}
            </h3>
          </div>
          <div className="flex items-center justify-center rounded-md relative" style={{ height: "50vh" }}>
            {currentStatus && currentStatus.length === 0 && (
              <p className="absolute text-lg mt-4" style={{ color: primaryColor }}>No status found</p>
            )}
            {currentStatus && <Swiper
              effect={'cards'}
              grabCursor={true}
              modules={[EffectCards]}
              className="mySwiper"
            >
              {currentStatus.length > 0 && currentStatus.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-[rgba(0,0,0,0.5)] w-full h-full flex justify-end flex-col relative">
                    <img className="object-contain max-h-full" src={item.mediaUrl} alt="Status" />
                    <p className="absolute bottom-0 h-fit max-w-full w-full flex justify-center px-3 bg-black opacity-60 text-white">{item.content}</p>
                    {user._id === currUser._id && (
                      <Button 
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-sm h-8"
                        onClick={() => deleteStatus(item._id)}
                      >
                        Delete
                      </Button>
                    )}
                    <Button className="absolute top-2 left-2 text-white bg-[#10b981] text-sm h-8">
                      {calculateTimeRemaining(item.expiresAt)}
                    </Button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewStatusModal;