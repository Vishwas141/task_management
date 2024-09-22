"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout",{withCredentials: true});
      toast.success("Logged out successfully");
      router.push("/login");
      
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-600 text-white shadow-md">
      <div className="text-xl font-bold">Task Manager</div>

      <div className="hidden md:flex space-x-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/board">Board</Link>
      </div>

      
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center focus:outline-none"
        >
          <FontAwesomeIcon
            icon={faUser}
            className="w-8 h-8 rounded-full bg-gray-700 p-1 hover:bg-gray-600 transition duration-200"
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 z-10 w-48 mt-2 bg-white text-black rounded-md shadow-lg transition-transform duration-200 ease-in-out">
            <div className="p-2 bg-gray-100 rounded-t-md text-center font-semibold">
              Profile Menu
            </div>
            <div className="p-3 hover:bg-gray-200 cursor-pointer rounded-md transition duration-200">
              <Link href="/dashboard" className="w-full text-center block">
                Dashboard
              </Link>
            </div>
            <div className="p-3 hover:bg-gray-200 cursor-pointer rounded-md transition duration-200">
              <Link href="/board" className="w-full text-center block">
                Board
              </Link>
            </div>

            <div
              className="p-3 hover:bg-gray-200 cursor-pointer rounded-md transition duration-200"
              onClick={handleLogout}
            >
              <div className="text-center">Logout</div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
