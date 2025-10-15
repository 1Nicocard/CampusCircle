import React from "react";

interface CardProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div
      className={`bg-white shadow-md shadow-black/5 rounded-2xl p-14 transition-transform hover:scale-[1.01] ${className}`}
    >
      {title && <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
