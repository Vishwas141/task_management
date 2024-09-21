"use client";
import { useRouter } from "next/navigation";
import { useEffect} from "react";
import axios from "axios";

export default function Home() {
  
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      const response = await axios.get("/api/auth", { withCredentials: true });
      
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
