import { useState } from "react";
import Chatbox from "../components/Chat/ChatBox";
import MyChats from "../components/Chat/MyChats";
import SideDrawer from "../components/UI/SideDrawer";
import { useAuthStore } from "../stores";
import { useUserDetails } from "../hooks/queries";
import ChatErrorBoundary from "../components/ErrorBoundary/ChatErrorBoundary";

const Chatpage = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [fetchAgain, setFetchAgain] = useState(false);

  // Auto-sync user data every 5 minutes
  useUserDetails(user?.email, {
    enabled: !!user?.email,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    onSuccess: (data) => {
      if (user.name !== data.name || user.pic !== data.pic) {
        updateUser({ name: data.name, pic: data.pic });
      }
    },
  });

  return (
    <ChatErrorBoundary>
      <div className="w-full overflow-hidden bg-black/5 h-screen flex flex-col gap-4 py-4 px-2 sm:px-4 md:px-4 lg:px-4 xl:px-8 2xl:px-16">
        {user && <SideDrawer />}
        <div className="flex w-full flex-1 gap-4 items-center min-h-0">
          {user && <MyChats />}
          <div className="hidden md:block w-0.5 h-full bg-neutral-300 rounded-md flex-shrink-0"></div>
          {user && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </div>
      </div>
    </ChatErrorBoundary>
  );
};

export default Chatpage;