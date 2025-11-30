import Step1ChatDemo from "./Step1ChatDemo";
import Step2ChatDemo from "./Step2ChatDemo";
import Step3ChatDemo from "./Step3ChatDemo";
import Step4ChatDemo from "./Step4ChatDemo";

const ChatFeaturesGrid = () => {
    const stepFeatures = [
        {
            id: 1,
            title: "Search & Connect",
            description: "Find users by name or email to start conversations",
            gradient: "bg-[radial-gradient(circle,_#3b82f6,_#60a5fa,_#93c5fd,_#bfdbfe,_transparent,transparent)]"
        },
        {
            id: 2,
            title: "Browse Chats",
            description: "Navigate through your conversations and group chats",
            gradient: "bg-[radial-gradient(circle,_#fb923c,_#fdba74,_#fed7aa,_#ffedd5,_transparent,transparent)]"
        },
        {
            id: 3,
            title: "AI Message Assistant",
            description: "Get smart suggestions to complete and improve your messages",
            gradient: "bg-[radial-gradient(circle,_#34d399,_#6ee7b7,_#a7f3d0,_#d1fae5,_transparent,transparent)]"
        },
        {
            id: 4,
            title: "Multilingual Translation",
            description: "Translate messages instantly between different languages",
            gradient: "bg-[radial-gradient(circle,_#a78bfa,_#c4b5fd,_#ddd6fe,_#ede9fe,_transparent,transparent)]"
        }
    ];

    return (
        <div className="grid grid-cols-2 auto-rows-fr gap-4 h-full w-full p-4">
            {stepFeatures.map((step) => (
                <div
                    key={step.id}
                    className="group rounded-lg p-3 border border-dashed flex flex-col gap-2 overflow-hidden relative"
                >
                    <div className={`w-full z-0 h-full scale-75 ease-out group-hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-80 translate-y-1/2 absolute bottom-0 left-1/2 ${step.gradient} blur-[64px]`}></div>
                    <div className="mb-3 flex-shrink-0 relative z-10">
                        <p className="text-lg font-saira font-medium text-neutral-600">
                            {step.title}
                        </p>
                        <p className="text-sm text-neutral-400 ">
                            {step.description}
                        </p>
                    </div>
                    <div className="relative z-10">
                        {step.id === 1 && <Step1ChatDemo />}
                        {step.id === 2 && <Step2ChatDemo />}
                        {step.id === 3 && <Step3ChatDemo />}
                        {step.id === 4 && <Step4ChatDemo />}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatFeaturesGrid;
