import { useEffect, useState } from "react";
import { getUserData } from "../(auth)/actions"; // Adjust the path if needed

interface UserData {
  id: string;
  email?: string;
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  return { userData, loading };
}
