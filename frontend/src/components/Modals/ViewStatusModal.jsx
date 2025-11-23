import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { deleteStatus, fetchStatus as fetchStatusAPI } from "@/api";

function ViewStatusModal({ fetchStatus, user, status, currUser }) {
  const [currentStatus, setCurrentStatus] = useState([]);

  const handleDeleteStatus = async (id) => {
    try {
      await deleteStatus(id);
      toast.success("Status deleted successfully");
      if (fetchStatus) {
        fetchStatus(user._id);
      } else {
        const statusData = await fetchStatusAPI(user._id);
        setCurrentStatus(statusData);
      }
    } catch (err) {
      // Error handling is done by interceptor
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
    if (fetchStatus) {
      fetchStatus(user._id);
    } else {
      fetchStatusAPI(user._id).then(setCurrentStatus);
    }
  }, [user._id, fetchStatus]);

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  return (
    <>
      <div className="flex-1 flex items-center justify-center mr-0 md:mr-2 mb-2 md:mb-0" id='swipercont'>
        <div className="w-full">
          <div className="flex items-center mb-4" style={{ color: "#10b981" }}>
            <img 
              src={user.pic} 
              className="w-9 h-9 rounded-full mr-2 border" 
              style={{ borderColor: "#10b981" }}
              alt={user.name}
            />
            <h3 className="text-xl font-semibold">
              {user._id === currUser._id ? "Your Status" : `${user.name}'s Status`}
            </h3>
          </div>
          <div className="flex items-center justify-center rounded-md relative h-[50vh]">
            {currentStatus && currentStatus.length === 0 && (
              <p className="absolute text-lg mt-4" style={{ color: "#10b981" }}>No status found</p>
            )}
            {currentStatus && <Swiper
              effect={'cards'}
              grabCursor={true}
              modules={[EffectCards]}
              className="w-[30vw] max-w-[400px] h-[60vh] min-w-[325px] min-h-[500px] xl:h-[50vh] lg:h-[40vh] md:min-w-[250px] md:min-h-[300px] md:h-[90%] sm:h-[30vh] [&_.swiper-slide]:rounded-[10px] [&_.swiper-slide]:text-base sm:[&_.swiper-slide]:text-sm"
            >
              {currentStatus.length > 0 && currentStatus.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-[rgba(0,0,0,0.5)] w-full h-full flex justify-end flex-col relative">
                    <img className="object-contain max-h-full" src={item.mediaUrl} alt="Status" />
                    <p className="absolute bottom-0 h-fit max-w-full w-full flex justify-center px-3 bg-black opacity-60 text-white">{item.content}</p>
                    {user._id === currUser._id && (
                      <Button 
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-sm h-8"
                        onClick={() => handleDeleteStatus(item._id)}
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