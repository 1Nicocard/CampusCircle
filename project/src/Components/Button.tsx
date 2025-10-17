import React, { useState } from "react";
import { Heart, MessageCircle, Globe } from "lucide-react";

type ButtonVariant =
  | "navigation"
  | "hero"
  | "important"
  | "secondary"
  | "select"
  | "label"
  | "reaction"
  | "social";

type ReactionType = "like" | "comment";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  count?: number;
  options?: string[];
  reactionType?: ReactionType;  // like o comment
  controlledCount?: number;   //  contador controlado desde el padre (Feed)
  readOnly?: boolean;         //  ignora clicks cuando es true
}

const baseFont = "font-[Satoshi]";

const variantClasses: Record<ButtonVariant, string> = {
  navigation: `${baseFont} bg-gradient-to-r from-blue-300 to-blue-500 text-white font-semibold 
    px-10 py-2.5 rounded-full 
    hover:from-blue-400 hover:to-blue-600 
    transition-all duration-300 shadow-sm 
    text-lg sm:text-xl md:text-2xl`,

  hero: `${baseFont} border border-blue-200 text-blue-500 font-semibold 
    px-10 py-2.5 rounded-full 
    hover:bg-gradient-to-r hover:from-emerald-300 hover:via-sky-300 hover:to-purple-300 hover:text-white 
    transition-all duration-300 
    text-lg sm:text-xl md:text-2xl`,

  important: `${baseFont} bg-blue-400 text-white font-semibold 
    px-10 py-2.5 rounded-full 
    hover:bg-blue-600 
    transition-all duration-300 
    text-lg sm:text-xl md:text-2xl`,

  secondary: "inline-flex items-center justify-center whitespace-nowrap leading-tight no-underline rounded-full border-2 border-blue-400 text-blue-500 font-medium px-12 py-5 hover:bg-blue-50 transition-all duration-300 text-xl sm:text-2xl",


  select: `${baseFont} relative border border-gray-300 text-gray-600 font-medium 
    px-10 py-2.5 rounded-full flex items-center justify-between 
    hover:border-gray-400 
    transition-all duration-300 
    text-lg sm:text-xl md:text-2xl`,

  label: `${baseFont} bg-gray-100 text-gray-400 font-medium 
    px-10 py-2.5 rounded-full cursor-not-allowed 
    text-lg sm:text-xl md:text-2xl`,

  reaction: `${baseFont} flex items-center gap-3 bg-gray-100 text-gray-400 font-medium 
    px-8 py-2.5 rounded-full 
    transition-all duration-300 
    text-lg sm:text-xl md:text-2xl hover:text-blue-400`,

  social: `${baseFont} flex items-center gap-3 bg-gray-100 text-gray-500 font-medium 
    px-8 py-2.5 rounded-full 
    transition-all duration-300 
    text-lg sm:text-xl md:text-2xl hover:bg-blue-500 hover:text-white`,
};

export const Button: React.FC<ButtonProps> = ({
  variant = "navigation",
  count,
  options,
  children,
  reactionType = "like",
  controlledCount,      // ← NUEVO
  readOnly,             // ← NUEVO
  className,             
  ...props
}) => {
  const [liked, setLiked] = useState(false);
  const [active, setActive] = useState(false);
  const [likeCount, setLikeCount] = useState(count || 0);

  const [selected, setSelected] = useState(options ? options[0] : "Select");
  const [open, setOpen] = useState(false);

  // --- Reacción: Like o Comentario ---
  const handleReaction = () => {
    if (readOnly) return; // 
  
    if (reactionType === "like") {
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } else if (reactionType === "comment") {
      // Para comentarios 
      
    }
  };

  // --- Reaction Button ---
  if (variant === "reaction") {
    const displayCount = controlledCount ?? likeCount; // prioridad al controlado
  
    return (
      <button
        {...props}
        onClick={handleReaction}
        aria-disabled={readOnly ? true : undefined}
        className={`${variantClasses.reaction} ${
          liked && reactionType === "like" ? "bg-blue-50 text-blue-500" : ""
        } ${readOnly ? "cursor-default" : ""}`}
      >
        {reactionType === "like" ? (
          <Heart
            size={20}
            fill={liked ? "#3B82F6" : "none"}
            stroke={liked ? "#3B82F6" : "currentColor"}
          />
        ) : (
          <MessageCircle size={20} />   // ← Ícono de comentario
        )}
        <span>{displayCount}</span>
      </button>
    );
  }

  // --- Social Button ---
  if (variant === "social") {
    return (
      <button
        {...props}
        onClick={() => setActive(!active)}
        className={`${variantClasses.social} ${
          active ? "bg-blue-50 text-blue-500" : ""
        }`}
      >
        <Globe
          size={20}
          className={`transition-colors duration-300 ${
            active ? "text-blue-500" : ""
          }`}
        />
        <span>Social</span>
      </button>
    );
  }

  // --- Select Button ---
  if (variant === "select" && options) {
    return (
      <div className="relative">
        <button
          {...props}
          onClick={() => setOpen(!open)}
          className={`${variantClasses.select} w-40`}
        >
          <span className="text-left flex-1">{selected}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 ml-2 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <ul className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-sm z-10">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => {
                  setSelected(option);
                  setOpen(false);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-lg"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // --- Default Button ---
return (
  <button
    {...props}
    className={`${variantClasses[variant]} ${className ?? ""}`}
  >
    {children}
  </button>
);
}
