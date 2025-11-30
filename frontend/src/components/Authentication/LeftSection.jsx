import EmptyChatState from "../Chat/EmptyChatState";

const LeftSection = () => {
  return (
    <div className="w-[60%] ring-2 relative ring-black/10 h-full bg-neutral-100 overflow-hidden flex-col gap-1  rounded-xl border-2 border-neutral-200/70 ">
      <div className="relative mt-6 ml-6 w-fit  p-3   border border-neutral-200 rounded-xl overflow-hidden">
        <div className="shadow-md bg-white rounded-lg py-2 px-6">
          <h1 className="text-3xl font-semibold text-neutral-600 font-saira">Get Started</h1>
          <h1 className="text-xl font-light italic mt-1 text-neutral-400 font-vend">futuristic alternative to your ordinary <span className="text-neutral-500 underline">chat app</span></h1>
        </div>
      </div>
      <div className="size-full   relative overflow-hidden rounded-xl">
        <div className="absolute top-0  pointer-events-none left-0 w-full h-full bg-white z-50"
          style={{
            maskImage: 'linear-gradient(to bottom,  transparent, transparent, transparent,  white)',
            WebkitMaskImage: 'linear-gradient(to bottom,   transparent, transparent, transparent,  white)'
          }} />
        <EmptyChatState isAuthPage={true} />
      </div>
    </div>
  );
};

export default LeftSection;

