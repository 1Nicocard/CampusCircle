import { useState, useRef } from "react";
import { Button } from "../../Components/Button";

export default function Post() {
  const subjects = ["Design", "Literature", "Math", "Science", "Social"];
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [header, setHeader] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    setFiles(prev => [...prev, ...Array.from(selected)]);
    e.currentTarget.value = "";
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf") return "https://cdn-icons-png.flaticon.com/512/337/337946.png";
    if (file.type.startsWith("image/")) return "https://cdn-icons-png.flaticon.com/512/337/337940.png";
    if (file.type.startsWith("video/")) return "https://cdn-icons-png.flaticon.com/512/1160/1160042.png";
    if (file.name.endsWith(".zip") || file.name.endsWith(".rar")) return "https://cdn-icons-png.flaticon.com/512/2306/2306311.png";
    return "https://cdn-icons-png.flaticon.com/512/833/833524.png";
  };

  return (
    <div className="container pt-40 pb-10 bg-[#F0F3FC] min-h-screen">

      {/* Title */}
      <div className="flex items-center gap-4 mb-10">
        <img src="/src/Assets/+.png" alt="Add" className="w-[77px] h-[77px]" />
        <h1 className="font-[Satoshi] font-bold text-[80px] text-[#0077FF]">Create your question</h1>
      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* LEFT PANEL */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[30px] shadow p-8 flex flex-col" style={{ height: "650px" }}>

          <input
            type="text"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            placeholder="Header"
            className="w-full bg-transparent outline-none font-[Satoshi] text-[50px] text-[#949494] placeholder-[#949494] mb-2"
          />

          <div className="h-[2px] w-full bg-[#CFCFCF] opacity-60 mb-4"></div>

          <div className="flex flex-wrap gap-3 mb-4">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => toggleSubject(subj)}
                className={`px-8 py-2 rounded-full border-[2px] text-[20px] font-[Satoshi] flex items-center gap-2
                ${selectedSubjects.includes(subj)
                  ? "bg-blue-400 text-white border-blue-400"
                  : "border-blue-400 text-blue-400 hover:bg-blue-50"}`}
              >
                {subj}
                {selectedSubjects.includes(subj) && <span>✕</span>}
              </button>
            ))}
          </div>

          {/* TEXTAREA BAJADA */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your question..."
            className="mt-8 w-full flex-grow resize-none bg-transparent outline-none font-sarala text-[24px] text-[#565656] placeholder:text-[#565656]/50"
          />

          <Button variant="important" className="self-end mt-3">Share</Button>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[30px] shadow p-8 flex flex-col items-center" style={{ height: "650px" }}>
          <h2 className="font-[Satoshi] font-bold text-[50px] text-[#454545] text-center">Files</h2>
          <div className="h-[2px] w-full bg-[#CFCFCF] opacity-60 mb-4"></div>

          {/* LISTA DE ARCHIVOS (CORRECTA) */}
          <div className="flex flex-col gap-3 flex-grow overflow-y-auto w-full pr-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <img src={getFileIcon(file)} className="w-8 h-8" />
                  <span className="font-sarala text-[20px] text-[#565656]">{file.name}</span>
                </div>
                <img
                  src="/src/Assets/trash.png"
                  onClick={() => removeFile(index)}
                  className="w-[22px] h-[26px] cursor-pointer opacity-70 hover:opacity-100"
                />
              </div>
            ))}
          </div>

          {/* INPUT + BUTTON */}
          <div className="mt-4 w-full text-center">
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>Add file</Button>
          </div>

        </div>
      </div>
    </div>
  );
}
