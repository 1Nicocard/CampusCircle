import React, { useState } from "react";
import { Heart, Globe } from "lucide-react";

type ButtonVariant =
  | "navigation"
  | "hero"
  | "important"
  | "secondary"
  | "select"
  | "label"
  | "reaction"
  | "social";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  count?: number; 
  options?: string[]; 
}

const baseFont = "font-[Satoshi]";

const variantClasses: Record<ButtonVariant, string> = {
  navigation:
    `${baseFont} bg-gradient-to-r from-blue-300 to-blue-500 text-white font-semibold px-6 py-2 rounded-full hover:from-blue-400 hover:to-blue-600 transition-all duration-300 shadow-sm text-sm sm:text-base`,
  hero:
    `${baseFont} bg-blue-100 text-blue-700 font-semibold px-6 py-2 rounded-full hover:bg-gradient-to-r hover:from-emerald-300 hover:via-sky-300 hover:to-purple-300 hover:text-white transition-all duration-300 text-sm sm:text-base`,
  important:
    `${baseFont} bg-blue-400 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-600 transition-all duration-300 text-sm sm:text-base`,
  secondary:
    `${baseFont} border border-blue-400 text-blue-500 font-semibold px-6 py-2 rounded-full hover:bg-blue-50 transition-all duration-300 text-sm sm:text-base`,
  select:
    `${baseFont} relative border border-gray-300 text-gray-600 font-medium px-6 py-2 rounded-full flex items-center justify-between hover:border-gray-400 transition-all duration-300 text-sm sm:text-base`,
  label:
    `${baseFont} bg-gray-100 text-gray-400 font-medium px-6 py-2 rounded-full cursor-not-allowed text-sm sm:text-base`,
  reaction:
    `${baseFont} flex items-center gap-2 bg-gray-100 text-gray-400 font-medium px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base hover:text-blue-400`,
  social:
    `${baseFont} flex items-center gap-2 bg-gray-100 text-gray-500 font-medium px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base hover:bg-blue-500 hover:text-white`,
};

export const Button: React.FC<ButtonProps> = ({
  variant = "navigation",
  count,
  options,
  children,
  ...props
}) => {
  const [liked, setLiked] = useState(false);
  const [active, setActive] = useState(false);
  const [likeCount, setLikeCount] = useState(count || 19);

  const [selected, setSelected] = useState(options ? options[0] : "Select");
  const [open, setOpen] = useState(false);

  const handleReaction = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleSocial = () => {
    setActive(!active);
  };

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
  };

  // --- Reaction Button ---
  if (variant === "reaction") {
    return (
      <button
        {...props}
        onClick={handleReaction}
        className={`${variantClasses.reaction} ${
          liked ? "bg-blue-50 text-blue-500" : ""
        }`}
      >
        <Heart
          size={16}
          fill={liked ? "#3B82F6" : "none"}
          stroke={liked ? "#3B82F6" : "currentColor"}
        />
        <span>{likeCount}</span>
      </button>
    );
  }

  // --- Social Button ---
  if (variant === "social") {
    return (
      <button
        {...props}
        onClick={handleSocial}
        className={`${variantClasses.social} ${
          active ? "bg-blue-50 text-blue-500" : ""
        }`}
      >
        <Globe
          size={16}
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
                onClick={() => handleSelect(option)}
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
    <button {...props} className={variantClasses[variant]}>
      {children}
    </button>
  );
};
