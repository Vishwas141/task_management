"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link"; // Import Link for navigation
import toast from "react-hot-toast";

export default function SignUp() {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangeInInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (userDetails.password !== userDetails.confirmPassword) {
      setLoading(false); 
      toast.error("Passwords do not match");
      return setError("Passwords do not match");
    }

    try {
        await axios.post("api/auth/register", {
        username: userDetails.username,
        email: userDetails.email,
        password: userDetails.password,
      });

  
      setUserDetails({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      router.push("/login");
    } catch (err) {
      setError("Something went wrong");
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full"
            value={userDetails.username}
            onChange={handleChangeInInput}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full"
            value={userDetails.email}
            onChange={handleChangeInInput}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full"
            value={userDetails.password}
            onChange={handleChangeInInput}
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full"
            value={userDetails.confirmPassword}
            onChange={handleChangeInInput}
            required
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
