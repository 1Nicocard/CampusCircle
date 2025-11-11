import type { ReactNode } from "react";

export default function AuthInput({
  icon, type="text", placeholder, value, onChange, disabled
}:{
  icon?: ReactNode;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v:string)=>void;
  disabled?: boolean;
}){
  return (
    <label className="block">
      <div className={`
        w-full h-[50px] rounded-[14px] bg-[#F3F4F6]
        border border-[#ECEFF3] px-4 flex items-center gap-3
        focus-within:ring-2 focus-within:ring-[#4EB2FF]
      `}>
        {icon && <span className="shrink-0 opacity-80">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e)=>onChange?.(e.target.value)}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-[15px] text-[#535B66] placeholder:text-[#B7BDC8]"
        />
      </div>
    </label>
  );
}

