// src/components/Input.js
export default function Input({ label, id, type = 'text', error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full px-3.5 py-2 rounded-lg border bg-white text-slate-900 shadow-xs 
          transition-colors duration-200 outline-hidden
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300'}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-600 font-medium">
          {error}
        </span>
      )}
    </div>
  );
}