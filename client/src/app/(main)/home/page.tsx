import { getUserData } from "@/app/(auth)/actions";
import HomePage from "@/components/homePage";
import React from "react";

export default async function homePage() {
  const userData = await getUserData();
  return (
    <div>
      <HomePage userData={userData} />
    </div>
  );
}
