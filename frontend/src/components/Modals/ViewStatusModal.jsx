import React from 'react'
import { Button } from "../UI/button";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { useStatus } from "../../hooks/queries";
import { useDeleteStatus } from "../../hooks/mutations/useStatusMutations";
import 'swiper/css';
import 'swiper/css/effect-cards';

function ViewStatusModal({ user, currUser }) {
  const { data: statusData, isLoading } = useStatus(user?._id, {
    enabled: !!user?._id,
  });
  const deleteStatusMutation = useDeleteStatus();
  
  // Ensure currentStatus is always an array
  const currentStatus = Array.isArray(statusData) ? statusData : [];

  const handleDeleteStatus = async (id) => {
    deleteStatusMutation.mutate({ statusId: id, userId: user._id });
  };

  const calculateTimeRemaining = (expiresAt) => {
    const diffInMs = new Date(expiresAt) - new Date();
    if (diffInMs <= 0) return 'Expired';
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `Expires in ${hours}h ${minutes}m` : `Expires in ${minutes}m`;
  };

  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center w-full py-4" id='swipercont'>
        <div className="flex items-center w-full"  >
          <img
            src={user.pic}
            className="w-9 h-9 rounded-full mr-2 border border-neutral-300"
            alt={user.name}
          />
          <h3 className="text-xl text-neutral-500 font-semibold">
            {user._id === currUser._id ? "Your Status" : `${user.name}'s Status`}
          </h3>
        </div>
        <div className="flex items-center justify-center rounded-md relative min-h-[400px]">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg" style={{ color: "#10b981" }}>Loading...</p>
            </div>
          ) : currentStatus.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg" style={{ color: "#10b981" }}>No status found</p>
            </div>
          ) : (
            <Swiper
              effect={'cards'}
              grabCursor={true}
              modules={[EffectCards]}
              className="w-full max-w-[300px] mt-4 h-[60vh] min-w-[280px] min-h-[400px] xl:h-[55vh] lg:h-[50vh] md:min-w-[250px] md:min-h-[350px] md:h-[50vh] sm:h-[45vh] sm:min-h-[300px] [&_.swiper-slide]:rounded-[10px] [&_.swiper-slide]:text-base sm:[&_.swiper-slide]:text-sm"
            >
              {currentStatus.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-[rgba(0,0,0,0.5)]  backdrop-blur-sm w-full h-full relative rounded-[10px] overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={item.mediaUrl}
                      alt="Status"
                    />
                    {item.content && (
                      <div className="absolute bottom-0 left-0 right-0 w-full px-3 py-2 bg-black/60 backdrop-blur-sm">
                        <p className="text-white text-center text-sm break-words">{item.content}</p>
                      </div>
                    )}
                    {user._id === currUser._id && (
                      <Button
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 z-10"
                        onClick={() => handleDeleteStatus(item._id)}
                        disabled={deleteStatusMutation.isPending}
                      >
                        Delete
                      </Button>
                    )}
                    <Button className="absolute top-2 left-2 text-white bg-[#10b981] hover:bg-[#059669] text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 z-10">
                      {calculateTimeRemaining(item.expiresAt)}
                    </Button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </>
  );
}

export default ViewStatusModal;