const MessageSkeleton = ({ isCurrentUser, width = "w-48" }) => {
  return (
    <div
      className={`flex relative ${isCurrentUser ? "ml-auto" : "ml-0"}`}
    >
    <div className="bg-white p-1 rounded-full shadow-md">
      <div
        className={`rounded-2xl py-4 flex items-center justify-center relative overflow-hidden ${
          isCurrentUser
            ? "text-neutral-500"
            : "text-black"
        } ${width}`}
      >
        <div className="absolute border border-black/5 inset-0 bg-gradient-to-r from-neutral-200  via-neutral-100 to-neutral-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
    </div>
  );
};

const MessageSkeletons = () => {
  const skeletonConfig = [
    { isCurrentUser: false, width: "w-56" },
    { isCurrentUser: true, width: "w-48" },
    { isCurrentUser: false, width: "w-64" },
    { isCurrentUser: true, width: "w-52" },
    { isCurrentUser: false, width: "w-44" },
    { isCurrentUser: true, width: "w-60" },
  ];

  return (
    <div className="flex flex-col gap-6 px-3 py-4">
      {skeletonConfig.map((config, index) => (
        <MessageSkeleton 
          key={index} 
          isCurrentUser={config.isCurrentUser} 
          width={config.width}
        />
      ))}
    </div>
  );
};

export default MessageSkeletons;
