"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      const response = await axios.get("/api/auth", { withCredentials: true });
      const data = response.data;


      if (response.status === 401) {
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
  
     }

    verifyUser();
  }, []);

  return null; 
}
