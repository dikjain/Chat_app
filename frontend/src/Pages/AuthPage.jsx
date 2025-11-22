import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LeftSection from "@/components/Authentication/LeftSection";
import LogoSection from "@/components/Authentication/LogoSection";
import AuthFormContainer from "@/components/Authentication/AuthFormContainer";

function Homepage() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <div className="w-full gap-6 h-screen bg-stone-100 flex p-6">
      <LeftSection />

      <div className="w-[30%] rounded-xl bg-white flex flex-col border-2 border-neutral-200/70 ring-2 relative ring-black/10 items-center justify-center p-6 mt-[72px] mb-[72px]">
        <AnimatePresence mode="wait">
          {activeTab === "login" && <LogoSection key="logo" />}
        </AnimatePresence>

        <AuthFormContainer
          activeTab={activeTab}
          onSwitchToSignup={() => setActiveTab("signup")}
          onSwitchToLogin={() => setActiveTab("login")}
        />
      </div>
    </div>
  );
}

export default Homepage;
