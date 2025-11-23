import { useEffect, useState } from "react";
import Chatbox from "@/components/Chat/ChatBox";
import MyChats from "@/components/Chat/MyChats";
import SideDrawer from "@/components/UI/SideDrawer";
import { useAuthStore } from "@/stores";
import { getUserDetails } from "@/api";
import ChatErrorBoundary from "@/components/ErrorBoundary/ChatErrorBoundary";

const Chatpage = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [fetchAgain, setFetchAgain] = useState(false);

  const syncUserData = async () => {
    if (!user?.email) return;

    try {
      const data = await getUserDetails(user.email);
      // Only update if data changed - uses immutable update
      if (user.name !== data.name || user.pic !== data.pic) {
        updateUser({ name: data.name, pic: data.pic });
      }
    } catch (error) {
      // Error handling is done by interceptor
    }
  };

  useEffect(() => {
    syncUserData();
  }, [user?.email]);

  return (
    <ChatErrorBoundary>
      <div className="w-full overflow-hidden">
        {user && <SideDrawer />}
        <div className="flex justify-between w-full h-[91.5vh] p-[10px]">
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </div>
      </div>
    </ChatErrorBoundary>
  );
};

export default Chatpage;