// src/Pages/auth/SignIn.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthProvider";
import AuthLayout from "./AuthLayout";
import AuthInput from "../../ui/AuthInput";
import AuthCTA from "../../ui/AuthCTA";

import emailIcon from "../../Assets/icons/mailicon.svg";
import lockIcon from "../../Assets/icons/passwordicon.svg";

export default function SignIn(){
  const nav = useNavigate();
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState<string>();
  const { signIn } = useAuth();

  function submit(e:React.FormEvent){
    e.preventDefault();
    setErr(undefined);
    void (async () => {
      const r = await signIn(email.trim(), pw.trim());
      if (!r.ok) return setErr(r.message || "Invalid credentials");
      nav("/feed", { replace: true });
    })();
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Log in to connect with your community and keep learning."
      topRightLink={
        <span>
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#111] font-bold hover:underline">Sign up</Link>
        </span>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <AuthInput
          placeholder="E-mail Address"
          value={email}
          onChange={setEmail}
          icon={<img src={emailIcon} className="w-4 h-4" />}
        />
        <AuthInput
          type="password"
          placeholder="Password"
          value={pw}
          onChange={setPw}
          icon={<img src={lockIcon} className="w-4 h-4" />}
        />

        {err && <p className="text-[#D14343] text-sm mt-1">{err}</p>}

        <div className="mt-2">
          <AuthCTA type="submit">Start now</AuthCTA>
        </div>
      </form>
    </AuthLayout>
  );
}
