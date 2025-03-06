import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { signOut } from "@/app/(auth)/actions";

const SignOut = () => {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <div className="animate-fadeIn fixed left-5 bottom-10">
      <Tooltip content="LogOut">
        <Button
          variant={"default"}
          size="icon"
          onClick={handleSignOut}
          className=" w-9 h-9"
        >
          <LogOut className="h-4 w-4" />
          {/* <p className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Log-Out
        </p> */}
        </Button>
      </Tooltip>
    </div>
  );
};

export default SignOut;
