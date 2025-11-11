import React from "react";

interface CardProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div
      className={`bg-white shadow-lg shadow-black/10 rounded-2xl p-14 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-black/15 border border-gray-100 ${className}`}
    >
      {title && <h2 className="text-xl font-semibold mb-6 text-gray-800 tracking-tight">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
