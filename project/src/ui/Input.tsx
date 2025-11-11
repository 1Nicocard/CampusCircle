import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  full?: boolean;
};

function Input({ full = true, className = "", ...rest }: Props) {
  return (
    <input
      className={
        `rounded-full px-6 py-3 text-[18px] md:text-[20px] font-sarala text-[#565656] outline-none
         focus:ring-2 focus:ring-[#4EB2FF] bg-white border border-[#CFCFCF]
         placeholder:text-gray-400 ` +
        (full ? "w-full " : "") + className
      }
      {...rest}
    />
  );
}

export default Input;
