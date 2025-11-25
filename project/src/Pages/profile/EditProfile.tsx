// src/Pages/profile/EditProfile.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile as updateProfileLocal } from "../../lib/auth";
import { updateProfileInSupabase } from "../../lib/supabaseApi";
import { useAuth } from "../../lib/AuthProvider";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { updatePostsUserInfo } from '../../store/postsSlice';

// ICONOS monoline (SVG) exportados desde Figma
import icInstitution from "../../Assets/icons/academicicon.svg";
import icProgram from "../../Assets/icons/programicon.svg";
import icTerm from "../../Assets/icons/calendaricon.svg";
import icEmail from "../../Assets/icons/mailicon.svg";
import icLock from "../../Assets/icons/passwordicon.svg";
import icUser from "../../Assets/icons/usericon.svg";
import icPencil from "../../Assets/icons/pencilicon.svg";

export default function EditProfile() {
  const nav = useNavigate();
  const { user: authUser, signOut, refreshUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const u = authUser || undefined;

  // ----- state (always call hooks) -----
  const [name, setName] = useState(u?.name || "");
  const [term, setTerm] = useState(u?.semester || "5th Semester");
  const [program, setProgram] = useState(u?.major || "Interactive Media Design");
  const [institution] = useState("Icesi");
  const [email] = useState(u?.email || "");
  const [password, setPassword] = useState("••••••••");
  const [avatar, setAvatar] = useState(u?.avatar || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const avatarPreview = useMemo(() => (avatar?.trim() ? avatar : "/src/Assets/defaultuser.png"), [avatar]);

  useEffect(() => { if (!u) nav("/signin"); }, [u, nav]);
  if (!u) return null;

  // ----- handlers -----
  async function onSave(e: FormEvent) {
    e.preventDefault();
    
    if (!authUser?.id) {
      console.error('Cannot save profile: user not authenticated');
      alert('You must be signed in to save profile changes');
      return;
    }

    // update both Supabase (if configured) and local fallback
    const payload = {
      username: name.trim(),
      term: term.trim(),
      career: program.trim(),
      avatar: avatar?.trim() || undefined, // include avatar URL if present
    };
    
    try {
      console.log('Saving profile to Supabase:', payload);
      
      // Save to Supabase
      const result = await updateProfileInSupabase(authUser.id, payload as any);
      console.log('Profile update result:', result);
      
      if (!result) {
        throw new Error('Profile update returned null');
      }
      
      // Update local fallback
      try { 
        updateProfileLocal({ 
          name: name.trim(), 
          semester: term.trim(), 
          major: program.trim(), 
          avatar: avatar?.trim() || undefined 
        }); 
      } catch (e) { 
        console.warn('Local update failed:', e);
      }
      
      // Refresh auth context so Profile page shows updated data
      console.log('Refreshing user context...');
      await refreshUser();
      console.log('User context refreshed successfully');
      
      // Update all posts in Redux with new user info
      console.log('Updating posts with new user info...');
      dispatch(updatePostsUserInfo({
        userId: authUser.id,
        username: name.trim(),
        career: program.trim(),
        term: term.trim(),
        avatar: avatar?.trim() || '/src/Assets/defaultuser.png'
      }));
      console.log('Posts updated in Redux store');
      
      // Navigate after all operations complete
      console.log('Navigating to /feed/profile...');
      nav("/feed/profile");
    } catch (error) { 
      console.error('Save failed with error:', error);
      alert(`Failed to save profile: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  function triggerFile() {
    fileRef.current?.click();
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setAvatar(dataUrl);
    };
    reader.readAsDataURL(f);

    // Upload to Supabase Storage in the background
    (async () => {
      try {
        if (authUser?.id) {
          console.log('Uploading avatar to Supabase Storage...');
          const { uploadAvatar } = await import('../../lib/supabaseApi');
          const avatarUrl = await uploadAvatar(f, authUser.id);
          
          if (avatarUrl) {
            console.log('Avatar uploaded successfully:', avatarUrl);
            // Update the avatar URL in state
            setAvatar(avatarUrl);
            // Update in local storage as fallback
            try { updateProfileLocal({ avatar: avatarUrl }); } catch (e) { void e; }
          } else {
            console.warn('Avatar upload returned null - check Supabase Storage bucket');
            alert('Failed to upload avatar. Make sure the "avatars" bucket exists in Supabase Storage.');
          }
        }
      } catch (e) { 
        console.error('Failed to upload avatar:', e);
        alert('Error uploading avatar: ' + (e instanceof Error ? e.message : String(e)));
      }
    })();
  }

  return (
    <section className="w-full bg-[#F4F7FB]">
      <div className="h-20 lg:h-64" /> {/* ✨ CAMBIO FINAL: h-20 para móvil, lg:h-64 para desktop */}

      <div className="container pb-20">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT — About me (sin botón) */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-[22px] border border-[#E6E8EE] shadow-[0_8px_24px_rgba(24,72,167,.10)] p-7 min-h-[360px]">
              <h2 className="font-satoshi font-bold text-[26px] text-[#222] mb-3">About me</h2>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E6E8EE] to-transparent mb-4" />
              <ul className="space-y-5">
                <AboutRow icon={icInstitution} label="Institution" value={institution} />
                <AboutRow icon={icProgram} label="Study Program" value={program} />
                <AboutRow icon={icTerm} label="Term" value={term} />
              </ul>
            </div>
          </aside>

          {/* RIGHT — Form card */}
          <main className="col-span-12 lg:col-span-8 relative">
            {/* Avatar grande centrado + lápiz blanco arriba */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10">
              <div className="relative">
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-[132px] h-[132px] rounded-full object-cover border-[8px] border-white shadow-[0_10px_28px_rgba(24,72,167,.20)]"
                />
                <button
                  type="button"
                  onClick={triggerFile}
                  className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white border border-[#E6E8EE] shadow flex items-center justify-center"
                  title="Change photo"
                >
                  <img src={icPencil} className="w-4 h-4 opacity-80" />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileSelected}
                />
              </div>
            </div>

            <div className="bg-white rounded-[22px] border border-[#E6E8EE] shadow-[0_8px_28px_rgba(24,72,167,.12)] px-6 md:px-8 pt-20 pb-8">
              <form onSubmit={onSave} className="space-y-5">
                {/* fila 1: Name / Term */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Name" value={name} onChange={setName} iconSrc={icUser} />
                  <Field label="Term" value={term} onChange={setTerm} iconSrc={icTerm} />
                </div>

                {/* resto apilado (uno por fila) */}
                <Field label="Study Program" value={program} onChange={setProgram} iconSrc={icProgram} />
                <Field label="Academic Institution" value={institution} disabled iconSrc={icInstitution} />
                <Field label="E-mail Address" value={email} disabled type="email" iconSrc={icEmail} />
                <Field label="Password" value={password} onChange={setPassword} type="password" iconSrc={icLock} />

                <div className="flex flex-col sm:flex-row gap-4 sm:justify-end pt-2">
                  <button
                    type="submit"
                    className="px-8 h-[44px] rounded-full bg-[#1E90FF] text-white font-ABeeZee text-[16px] hover:bg-[#1478E9] transition"
                  >
                    Save
                  </button>
                  <Link
                    to="/signin"
                    onClick={() => void signOut()}
                    className="px-8 h-[44px] rounded-full border-2 border-[#1E90FF] text-[#1E90FF] font-ABeeZee text-[16px] hover:bg-blue-50 transition text-center flex items-center justify-center"
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

/* --------- subcomponents --------- */

function AboutRow({ icon, label, value }: { icon: string; label: string; value: string; }) {
  return (
    <li className="flex items-start gap-3">
      <img src={icon} className="w-5 h-5 opacity-70 mt-[2px]" />
      <div className="text-[15px] md:text-[16px]">
        <b className="text-[#2B2F36]">{label}:</b>{" "}
        <span className="text-[#565C66]">{value}</span>
      </div>
    </li>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  type = "text",
  placeholder,
  iconSrc, // icono monoline
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  iconSrc?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] text-[#8B94A5] mb-2">{label}</span>
      <div
        className={`w-full h-[48px] rounded-full border border-[#E6E8EE] bg-[#F6F8FC] px-5 flex items-center gap-2
        ${disabled ? "opacity-80" : "focus-within:ring-2 focus-within:ring-[#4EB2FF]"}`}
      >
        {iconSrc && <img src={iconSrc} className="w-4 h-4 opacity-70" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-[15px] text-[#2B2F36] placeholder:text-[#AAB2C0]"
        />
      </div>
    </label>
  );
}