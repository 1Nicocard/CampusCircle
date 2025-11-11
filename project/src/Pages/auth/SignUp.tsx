import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, type User } from "../../lib/auth";
import AuthLayout from "./AuthLayout";
import AuthInput from "../../ui/AuthInput";
import AuthCTA from "../../ui/AuthCTA";

import userIcon from "../../Assets/icons/usericon.svg";
import calendarIcon from "../../Assets/icons/calendaricon.svg";
import briefcaseIcon from "../../Assets/icons/programicon.svg";
import universityIcon from "../../Assets/icons/academicicon.svg";
import emailIcon from "../../Assets/icons/mailicon.svg";
import lockIcon from "../../Assets/icons/passwordicon.svg";

export default function SignUp(){
  const nav = useNavigate();
  const [name,setName]=useState("");
  const [term,setTerm]=useState("");
  const [program,setProgram]=useState("");
  const [institution,setInstitution]=useState("Icesi");
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState<string>();

  function submit(e:React.FormEvent){
    e.preventDefault();
    if(!name || !email || !pw) return setErr("Please complete required fields.");
    setErr(undefined);

    const u:User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      major: program.trim() || undefined,
      semester: term.trim() || undefined,
    };
    signUp(u);
    nav("/profile");
  }

  return (
    <AuthLayout
      title="Sign up"
      subtitle="Create your account and connect with your community"
      topRightLink={
        <span>
          Already have an account?{" "}
          <Link to="/signin" className="text-[#111] font-bold hover:underline">Sign in</Link>
        </span>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AuthInput placeholder="Name" value={name} onChange={setName} icon={<img src={userIcon} className="w-4 h-4" />} />
          <AuthInput placeholder="Term" value={term} onChange={setTerm} icon={<img src={calendarIcon} className="w-4 h-4" />} />
        </div>
        <AuthInput placeholder="Study Program" value={program} onChange={setProgram} icon={<img src={briefcaseIcon} className="w-4 h-4" />} />
        <AuthInput placeholder="Academic Institution" value={institution} onChange={setInstitution} icon={<img src={universityIcon} className="w-4 h-4" />} />
        <AuthInput placeholder="E-mail Address" value={email} onChange={setEmail} icon={<img src={emailIcon} className="w-4 h-4" />} />
        <AuthInput type="password" placeholder="Password" value={pw} onChange={setPw} icon={<img src={lockIcon} className="w-4 h-4" />} />

        {err && <p className="text-[#D14343] text-sm mt-1">{err}</p>}

        <div className="mt-2">
          <AuthCTA type="submit">Start now</AuthCTA>
        </div>
      </form>
    </AuthLayout>
  );
}


