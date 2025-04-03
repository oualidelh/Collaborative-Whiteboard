"use client";
import { signOut } from "@/app/(auth)/actions";
import { LogOut } from "lucide-react";
import React from "react";

const NavBar = () => {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <nav className="fixed z-10 w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div className="text-xl font-bold text-primary">
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
