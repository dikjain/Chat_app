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
      <div className="w-full overflow-hidden bg-black/5    h-screen flex flex-col gap-4 py-4 px-16">
        {user && <SideDrawer />}
        <div className="flex w-full flex-1 gap-4 items-center min-h-0">
          {user && <MyChats fetchAgain={fetchAgain} />}
          <div className="w-0.5  h-full bg-neutral-300 rounded-md flex-shrink-0"></div>
          {user && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </div>
      </div>
    </ChatErrorBoundary>
  );
};

export default Chatpage;