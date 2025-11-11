// src/Pages/profile/EditProfile.tsx
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, updateProfile, signOut } from "../../lib/auth";

export default function EditProfile(){
  const nav = useNavigate();
  const u = getCurrentUser();
  // Call hooks unconditionally. Use optional chaining for initial values in case user is null on first render.
  const [name,setName]=useState<string>(u?.name||"");
  const [term,setTerm]=useState<string>(u?.semester||"5th Semester");
  const [program,setProgram]=useState<string>(u?.major||"Interactive Media Design");
  const [institution] = useState<string>("Icesi");
  const [email] = useState<string>(u?.email||"");
  const [password,setPassword]=useState<string>("••••••••");
  const [avatar,setAvatar]=useState<string>(u?.avatar||"");

  const avatarPreview = useMemo(()=> avatar?.trim() || "/src/Assets/Foto user.jpg",[avatar]);

  useEffect(()=>{ if(!u) nav("/signin"); },[u,nav]);
  if(!u) return null;

  function save(e: FormEvent){
    e.preventDefault();
    updateProfile({ name, semester:term, major:program, avatar:avatar || undefined });
    nav("/profile");
  }

  return (
    <section className="w-full bg-[var(--cc-bg)]">
      {/* top spacing (Nav fijo) */}
      <div className="h-32" />

      <div className="container pb-20">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT – About me (igual al dashboard) */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="bg-[var(--cc-card)] rounded-[var(--cc-radius-card)] shadow-[var(--cc-shadow)] p-6 md:p-7 border border-[var(--cc-border)]">
              <h2 className="text-[22px] font-satoshi font-bold text-[#222] mb-4">About me</h2>
              <hr className="border-t border-[var(--cc-border)] mb-4" />
              <ul className="space-y-4 text-[15px] md:text-[16px]">
                <li className="flex items-start gap-3">
                  <span className="opacity-70 mt-[2px]">🏫</span>
                  <div><b className="text-[#2B2F36]">Institution:</b> <span className="text-[var(--cc-text)]">{institution}</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="opacity-70 mt-[2px]">📚</span>
                  <div><b className="text-[#2B2F36]">Study Program:</b> <span className="text-[var(--cc-text)]">{program}</span></div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="opacity-70 mt-[2px]">📅</span>
                  <div><b className="text-[#2B2F36]">Term:</b> <span className="text-[var(--cc-text)]">{term}</span></div>
                </li>
              </ul>
            </div>
          </aside>

          {/* RIGHT – Form card */}
          <main className="col-span-12 lg:col-span-8 relative">
            {/* avatar floating */}
            <div className="absolute -top-14 right-8 md:-top-16 md:right-10 z-10">
              <div className="relative">
                <img
                  src={avatarPreview}
                  className="w-[96px] h-[96px] md:w-[110px] md:h-[110px] rounded-full object-cover border-4 border-white shadow-[var(--cc-shadow)]"
                />
                <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[var(--cc-blue)] text-white flex items-center justify-center text-sm cursor-pointer shadow">
                  ✏️
                  <input
                    type="text"
                    className="hidden"
                    onChange={()=>{}}
                    // Si quieres cambiar avatar con un modal/input externo, deja el trigger aquí
                  />
                </label>
              </div>
            </div>

            <div className="bg-[var(--cc-card)] rounded-[var(--cc-radius-card)] shadow-[var(--cc-shadow)] p-6 md:p-8 border border-[var(--cc-border)]">
              <form onSubmit={save} className="space-y-5">
                {/* fila 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Name" value={name} onChange={setName} />
                  <Field label="Term" value={term} onChange={setTerm} />
                </div>
                {/* fila 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Study Program" value={program} onChange={setProgram} />
                  <Field label="Academic Institution" value={institution} disabled />
                </div>
                {/* fila 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="E-mail Address" value={email} disabled />
                  <Field label="Password" value={password} onChange={setPassword} type="password" />
                </div>
                {/* fila 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Avatar URL" value={avatar} onChange={setAvatar} placeholder="https://…" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:justify-end pt-2">
                  <button
                    type="submit"
                    className="px-8 h-[44px] rounded-[var(--cc-radius-pill)] bg-[var(--cc-blue)] text-white font-ABeeZee text-[16px] hover:bg-[var(--cc-blue-dark)] transition"
                  >
                    Save
                  </button>
                  <Link
                    to="/signin"
                    onClick={()=>{ signOut(); }}
                    className="px-8 h-[44px] rounded-[var(--cc-radius-pill)] border-2 border-[var(--cc-blue)] text-[var(--cc-blue)] font-ABeeZee text-[16px] hover:bg-blue-50 transition text-center flex items-center justify-center"
                  >
                    Log out
                  </Link>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, value, onChange, disabled, type="text", placeholder
}:{
  label:string; value:string; onChange?:(v:string)=>void;
  disabled?:boolean; type?:string; placeholder?:string;
}){
  return (
    <label className="w-full block">
      <span className="block text-[13px] text-[var(--cc-muted)] mb-2">{label}</span>
      <div className={`w-full h-[48px] rounded-[999px] border border-[var(--cc-border)] bg-[#F6F8FC] px-5 flex items-center
        ${disabled ? "opacity-80" : "focus-within:ring-2 focus-within:ring-[var(--cc-blue)]"}`}>
        <input
          type={type}
          value={value}
          onChange={e=>onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-[15px] text-[#2B2F36] placeholder:text-[#AAB2C0]"
        />
      </div>
    </label>
  );
}
