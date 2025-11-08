import { useState, useRef } from "react";
import { Button } from "../../Components/Button";
import { Trash2 } from "lucide-react";

export default function Post() {
  // Subjects selector
  const subjects = ["Design", "Literature", "Math", "Science", "Social"];
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Text fields
  const [header, setHeader] = useState("");
  const [text, setText] = useState("");

  // Files manager
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // File style + open
  const getFileIcon = (file: File) => {
    const name = file.name.toLowerCase();
    if (name.endsWith(".pdf")) return "https://cdn-icons-png.flaticon.com/512/337/337946.png";
    if (name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png"))
      return "https://cdn-icons-png.flaticon.com/512/337/337940.png";
    if (name.endsWith(".mp3")) return "https://cdn-icons-png.flaticon.com/512/727/727240.png";
    return "https://cdn-icons-png.flaticon.com/512/833/833524.png";
  };

  const formatFileName = (name: string) =>
    name.length > 45 ? name.slice(0, 45) + "..." : name;

  const openFile = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  // Share action
  const handleShare = () => {
    if (header.trim() === "" || text.trim() === "") {
      alert("Please complete the Header and Question before sharing.");
      return;
    }
    console.log("✅ Enviar datos:", { header, text, selectedSubjects, files });
  };

  return (
    <div className="container pt-36 pb-10 bg-[#F0F3FC] min-h-screen">

      {/* Title */}
      <div className="flex flex-col items-center text-center gap-2 mb-10 lg:flex-row lg:text-left lg:items-center lg:gap-4">
        <img src="/src/Assets/+.png" alt="Add" className="w-[77px] h-[77px]" />
        <h1 className="font-[Satoshi] font-bold text-[#0077FF] text-[45px] lg:text-[80px] text-center">
          Create your question
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* Panel left */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[30px] shadow p-8 flex flex-col" style={{ height: "650px" }}>

          <input
            type="text"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            placeholder="Header"
            className="w-full bg-transparent outline-none font-[Satoshi] text-[40px] lg:text-[50px] text-[#949494] placeholder-[#949494] mb-2"
          />

          <div
            className="w-full rounded-full mb-4"
            style={{ height: "2px", background: "linear-gradient(90deg, #FFFFFF 0%, #CFCFCF 5%, #CFCFCF 95%, #FFFFFF 100%)" }}
          ></div>

          {/* Subject tags */}
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

          {/* Question text */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your question..."
            className="mt-6 w-full flex-grow resize-none bg-transparent outline-none font-sarala text-[24px] text-[#565656] placeholder:text-[#565656]/50"
          />

          {/* Share button desktop */}
          <Button
            variant="important"
            className="self-end mt-3 hidden lg:block"
            disabled={header.trim() === "" || text.trim() === ""}
            onClick={handleShare}
          >
            Share
          </Button>
        </div>

        {/* Panel right */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[30px] shadow p-8 flex flex-col items-center" style={{ height: "650px" }}>

          <h2 className="font-[Satoshi] font-bold text-[40px] lg:text-[50px] text-[#454545] text-center">Files</h2>

          <div
            className="w-full rounded-full mb-4"
            style={{ height: "2px", background: "linear-gradient(90deg, #FFFFFF 0%, #CFCFCF 5%, #CFCFCF 95%, #FFFFFF 100%)" }}
          ></div>

          {/* File list */}
          <div className="flex flex-col gap-4 flex-grow overflow-y-auto w-full pr-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-1 py-3 rounded-lg hover:bg-[#F5F7FB] transition cursor-pointer"
                onClick={() => openFile(file)}
              >
                <div className="flex items-center gap-3 w-[80%]">
                  <img src={getFileIcon(file)} className="w-8 h-8 flex-shrink-0" />
                  <span title={file.name} className="font-sarala text-[20px] text-[#565656] truncate">
                    {formatFileName(file.name)}
                  </span>
                </div>

                <Trash2
                  size={26}
                  color="#CFCFCF"
                  className="cursor-pointer hover:opacity-70 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Add file */}
          <div className="mt-4 w-full text-center">
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.mp3" className="hidden" onChange={handleFileUpload} />
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              Add file
            </Button>
          </div>
        </div>
      </div>

      {/* Share button mobile */}
      <Button
        variant="important"
        className="block lg:hidden mx-auto mt-6"
        disabled={header.trim() === "" || text.trim() === ""}
        onClick={handleShare}
      >
        Share
      </Button>
    </div>
  );
}
