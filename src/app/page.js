"use client"

import Auth from "@/components/auth/Auth";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const { user, loading } = useAuth();
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [loading, user])

  return (
    <div className="">
      {loading ? <h1>Loading...</h1> : <Auth />}
    </div>
  );
}
