"use client";
import { signOut } from "@/app/(auth)/actions";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const NavBar = () => {
  const router = useRouter();
  const handleHomeReturn = () => {
    router.push("/home");
  };
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <nav className="fixed z-50 w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div
        onClick={handleHomeReturn}
        className="text-xl font-bold text-primary cursor-pointer hover:text-sage-600 transition-colors"
      >
        Collaborative Whiteboard
      </div>
      <button
        onClick={handleSignOut}
        className="flex items-center font-bold hover:text-primary gap-2 text-text-gray-800 transition-colors"
      >
        <LogOut size={20} />
        Logout
      </button>
    </nav>
  );
};

export default NavBar;
