// src/ui/AuthCTA.tsx
export default function AuthCTA({
  children, onClick, type="button", disabled
}:{
  children: React.ReactNode;
  onClick?: ()=>void;
  type?: "button"|"submit";
  disabled?: boolean;
}){
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full h-[52px] rounded-full text-white font-ABeeZee text-[18px]
        bg-[linear-gradient(180deg,_#4EB2FF_0%,_#2F96F9_70%,_#7FC1FF_100%)]
        shadow-[0_10px_22px_rgba(40,138,236,.35)]
        hover:brightness-[1.05] transition disabled:opacity-60
      `}
    >
      {children}
    </button>
  );
}

