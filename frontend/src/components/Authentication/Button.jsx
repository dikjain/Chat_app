const Button = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  loadingText = "Loading...",
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseClasses = "relative font-saira px-4 py-2.5 overflow-hidden rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-gradient-to-t from-green-400 to-green-500 border border-black/5 text-white",
    secondary: "bg-green-500 hover:bg-green-600 border border-black/5 text-white",
    white: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  const buttonStyle = variant === "primary" 
    ? { boxShadow: "inset 0px 3px 6px rgba(255,255,255,0.5), 0px 2px 6px rgba(0,0,0,0.1)" }
    : variant === "white"
    ? { boxShadow: "0px 1px 2px rgba(0,0,0,0.05)" }
    : {};

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={buttonStyle}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

