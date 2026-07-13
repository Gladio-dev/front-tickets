// src/components/Button.js
export default function Button({ children, type = 'button', variant = 'primary', fullWidth = false, ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg text-sm px-4 py-2.5 transition-all duration-200 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
      {...props}
    >
      {children} 
    </button>
  );
}