import { useState, useRef } from "react";
import { Button } from "../../Components/Button";
import { Trash2 } from "lucide-react";
import usersData from "../../Data/users.json"; // <-- fallback si no hay sesión (ok)
import { useAuth } from "../../lib/AuthProvider";
import * as supabaseApi from '../../lib/supabaseApi';
import { useDispatch } from 'react-redux'
import { addPost, createPost } from '../../store/postsSlice'
import type { Post, PostFile } from '../../lib/postStore';
import type { User } from '../../lib/auth';
import type { AppDispatch } from '../../store/store';


export default function Post() {
  const subjects = ["Design", "Literature", "Math", "Science", "Social"];
  const dispatch = useDispatch<AppDispatch>();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [header, setHeader] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user: authUser } = useAuth();

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
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

  const getFileIcon = (file: File) => {
    const name = file.name.toLowerCase();
    if (name.endsWith(".pdf"))
      return "https://cdn-icons-png.flaticon.com/512/337/337946.png";
    if (name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png"))
      return "https://cdn-icons-png.flaticon.com/512/337/337940.png";
    if (name.endsWith(".mp3"))
      return "https://cdn-icons-png.flaticon.com/512/727/727240.png";
    return "https://cdn-icons-png.flaticon.com/512/833/833524.png";
  };

  const formatFileName = (name: string) =>
    name.length > 45 ? name.slice(0, 45) + "..." : name;

  const openFile = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  const handleShare = async () => {
    if (header.trim() === "" || text.trim() === "") {
      alert("Please complete the Header and Question before sharing.");
      return;
    }

    // require auth for publishing to Supabase; if not signed in, redirect to sign in
    if (!authUser) {
      alert('Please sign in to publish posts.');
      // send them to sign-in page
      window.location.href = '/signin';
      return;
    }

    const currentUser = (authUser as any) || usersData.users[0]; // fallback: Sergio del seed


    const now = new Date();
    // Normalize post shape to match Feed/postStore expectations
    const mapType = (name: string | undefined) => {
      const ext = (name || '').toLowerCase().split('.').pop();
      if (ext === 'pdf') return 'pdf' as const;
      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return 'img' as const;
      if (ext === 'doc' || ext === 'docx') return 'doc' as const;
      return 'other' as const;
    };

    // upload attachments to Supabase Storage (if available) and replace URLs
    let postFiles: PostFile[] = [];
    try {
      const uid = (authUser as any)?.id || null;
      const uploaded = await Promise.all(
        files.map(async (f) => {
          try {
            const url = await supabaseApi.uploadFile(f, uid);
            return { id: `f_${Date.now()}_${f.name}`, type: mapType(f.name), url: url || URL.createObjectURL(f), label: f.name } as PostFile;
          } catch (e) { void e; return { id: `f_${Date.now()}_${f.name}`, type: mapType(f.name), url: URL.createObjectURL(f), label: f.name } as PostFile; }
        })
      );
      postFiles = uploaded.filter(Boolean) as PostFile[];
    } catch (e) { console.warn('upload attachments failed', e); postFiles = files.map((f) => ({ id: `f_${Date.now()}_${f.name}`, type: mapType(f.name), url: URL.createObjectURL(f), label: f.name } as PostFile)); }

    const newPost: Post = {
      id: String(Date.now()),
      user: currentUser as User,
      createdAt: now.toISOString(),
      tag: selectedSubjects[0] || "General",
      // combine header and body into content so Feed can extract title
      content: `${header}\n\n${text}`,
      files: postFiles,
      likes: 0,
      comments: 0,
      commentsList: [],
      likedBy: [],
    };

    try {
      // prefer Supabase-backed creation; createPost will fallback to localStorage if needed
      const res = await dispatch(createPost(newPost));
      const created = (res as any)?.payload as Post | null;
      if (!created) {
        // fallback to redux addPost so UI still updates
        dispatch(addPost(newPost));
      }
    } catch (err) {
      console.warn('Failed to save post', err);
      try {
        const existing = JSON.parse(localStorage.getItem("posts") || "[]");
        const updated = [newPost, ...existing];
        localStorage.setItem("posts", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('posts:update'));
      } catch (err2) { void err2; }
    }

    alert("✅ Post shared successfully!");
    setHeader("");
    setText("");
    setFiles([]);
    setSelectedSubjects([]);
  };

  return (
    <div className="container pt-36 pb-10 bg-[#F0F3FC] min-h-screen">
      <div className="flex flex-col items-center text-center gap-2 mb-10 lg:flex-row lg:text-left lg:items-center lg:gap-4">
        <img src="/src/Assets/+.png" alt="Add" className="w-[77px] h-[77px]" />
        <h1 className="font-[Satoshi] font-bold text-[#0077FF] text-[45px] lg:text-[80px] text-center">
          Create your question
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div
          className="col-span-12 lg:col-span-8 bg-white rounded-[30px] shadow p-8 flex flex-col"
          style={{ height: "650px" }}
        >
          <input
            type="text"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            placeholder="Header"
            className="w-full bg-transparent outline-none font-[Satoshi] text-[40px] lg:text-[50px] text-[#949494] placeholder-[#949494] mb-2"
          />

          <div
            className="w-full rounded-full mb-4"
            style={{
              height: "2px",
              background:
                "linear-gradient(90deg, #FFFFFF 0%, #CFCFCF 5%, #CFCFCF 95%, #FFFFFF 100%)",
            }}
          ></div>

          <div className="flex flex-wrap gap-3 mb-4">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => toggleSubject(subj)}
                className={`px-8 py-2 rounded-full border-[2px] text-[20px] font-[Satoshi] flex items-center gap-2 ${
                  selectedSubjects.includes(subj)
                    ? "bg-blue-400 text-white border-blue-400"
                    : "border-blue-400 text-blue-400 hover:bg-blue-50"
                }`}
              >
                {subj}
                {selectedSubjects.includes(subj) && <span>✕</span>}
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your question..."
            className="mt-6 w-full flex-grow resize-none bg-transparent outline-none font-sarala text-[24px] text-[#565656] placeholder:text-[#565656]/50"
          />

          <Button
            variant="important"
            className="self-end mt-3 hidden lg:block"
            disabled={header.trim() === "" || text.trim() === ""}
            onClick={handleShare}
          >
            Share
          </Button>
        </div>

        <div
          className="col-span-12 lg:col-span-4 bg-white rounded-[30px] shadow p-8 flex flex-col items-center"
          style={{ height: "650px" }}
        >
          <h2 className="font-[Satoshi] font-bold text-[40px] lg:text-[50px] text-[#454545] text-center">
            Files
          </h2>

          <div
            className="w-full rounded-full mb-4"
            style={{
              height: "2px",
              background:
                "linear-gradient(90deg, #FFFFFF 0%, #CFCFCF 5%, #CFCFCF 95%, #FFFFFF 100%)",
            }}
          ></div>

          <div className="flex flex-col gap-4 flex-grow overflow-y-auto w-full pr-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-1 py-3 rounded-lg hover:bg-[#F5F7FB] transition cursor-pointer"
                onClick={() => openFile(file)}
              >
                <div className="flex items-center gap-3 w-[80%]">
                  <img
                    src={getFileIcon(file)}
                    className="w-8 h-8 flex-shrink-0"
                  />
                  <span
                    title={file.name}
                    className="font-sarala text-[20px] text-[#565656] truncate"
                  >
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

          <div className="mt-4 w-full text-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.mp3"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Add file
            </Button>
          </div>
        </div>
      </div>

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
