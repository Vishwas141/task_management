"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get("/api/auth", {
          withCredentials: true,
        });

        if (response.status === 200) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
        console.log(error);
      }
    };

    verifyUser();
  }, [router]);

  return null;
}
