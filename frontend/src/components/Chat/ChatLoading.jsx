import { Skeleton } from "@/components/UI/skeleton";

const ChatLoading = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="rounded-lg h-[45px]" />
      <Skeleton className="rounded-lg h-[45px]" />
      <Skeleton className="rounded-lg h-[45px]" />
      <Skeleton className="rounded-lg h-[45px]" />
      <Skeleton className="rounded-lg h-[45px]" />
      <Skeleton className="rounded-lg h-[45px]" />
      <Skeleton className="rounded-lg h-[45px]" />
      <Skeleton className="rounded-lg h-[45px]" />
      <Skeleton className="rounded-lg h-[45px]" />
      <Skeleton className="rounded-lg h-[45px]" />
      <Skeleton className="rounded-lg h-[45px]" />
      <Skeleton className="rounded-lg h-[45px]" />
    </div> 
  );
};

export default ChatLoading;