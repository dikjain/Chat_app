import MapView from "./MapView";

const MessageContent = ({ message, isCurrentUser, isGroupChat }) => {
  if (!message.content && !message.file) return null;

  // Extract coordinates from Google Maps URL
  const parseLocationUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    // Try to match Google Maps URL format: https://www.google.com/maps?q=lat,lng
    const match = url.match(/[?&]q=([^&]+)/);
    if (match) {
      const coords = match[1].split(',');
      const lat = parseFloat(coords[0]);
      const lng = parseFloat(coords[1]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
    // Fallback: try to extract from URL directly if it's just coordinates
    const directMatch = url.match(/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (directMatch) {
      const lat = parseFloat(directMatch[1]);
      const lng = parseFloat(directMatch[2]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
    return null;
  };

  return (
    <>
      {isGroupChat && !isCurrentUser && (
        <span className="font-bold" style={{ color: "#10b981" }}>
          {message.sender?.name + " : "}
        </span>
      )}
      {message.content ? (
        message.type === "location" ? (
          <div className="w-full -mx-4 -my-1" style={{ minWidth: "300px", maxWidth: "calc(100vw - 100px)", marginTop: "-4px", marginBottom: "-4px" }}>
            {(() => {
              const coords = parseLocationUrl(message.content);
              console.log("Location message:", { content: message.content, coords });
              return coords ? (
                <MapView lat={coords.lat} lng={coords.lng} />
              ) : (
                <div className="flex flex-col gap-2 p-2">
                  <a 
                    href={message.content} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="underline text-blue-500 font-sans"
                  >
                    {message.content}
                  </a>
                  <p className="text-xs text-gray-500">Unable to parse coordinates from URL</p>
                </div>
              );
            })()}
          </div>
        ) : (
          message.content
        )
      ) : (
        <div 
          onClick={() => {
            const newWindow = window.open(message.file, "_blank", "noopener,noreferrer");
            if (newWindow) {
              newWindow.opener = null;
            }
          }}
          className="size-[100px] bg-gray-100 flex items-end justify-center rounded-[10px] opacity-80 bg-cover bg-center cursor-pointer"
        >
          <img
            src={message.file}
            alt="File thumbnail"
            loading="lazy"
            className="block size-full object-cover rounded-[10px]"
          />
        </div>
      )}
      {message.file && (
        <p 
          className="text-[10px] max-w-[150px] text-center font-semibold" 
          style={{ color: isCurrentUser ? "#10b981" : "#fff" }}
        >
          {message.file.split("/").pop()}
        </p>
      )}
    </>
  );
};

export default MessageContent;

