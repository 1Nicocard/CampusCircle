import React from "react";

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[18px] md:text-[20px] font-satoshi font-bold text-[#454545]">
        {label}
      </label>
      {children}
    </div>
  );
}

export default Field;
