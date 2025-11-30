import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores";
import AuthErrorBoundary from "@/components/ErrorBoundary/AuthErrorBoundary";
import { AnimatePresence } from "framer-motion";
import LeftSection from "@/components/Authentication/LeftSection";
import LogoSection from "@/components/Authentication/LogoSection";
import AuthFormContainer from "@/components/Authentication/AuthFormContainer";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) navigate("/chats");
  }, [user, navigate]);

  return (
    <AuthErrorBoundary>
      <div className="w-full gap-6 h-screen bg-stone-100 flex p-6">
        <LeftSection />

        <div className="w-[30%] mx-auto shadow-xl rounded-xl bg-white flex flex-col border-2 border-neutral-200/70 ring-2 relative ring-black/10 items-center justify-center py-6 mt-[72px] mb-[72px]">
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
    </AuthErrorBoundary>
  );
}

export default AuthPage;
