function ErrorText({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="text-[#D14343] text-sm md:text-base font-satoshi mt-1">
      {text}
    </p>
  );
}

export default ErrorText;
  
