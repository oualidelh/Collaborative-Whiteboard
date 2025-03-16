import HomePage from "@/components/homePage";
import { getUserData } from "./(auth)/actions";

export default async function Home() {
  const userData = await getUserData();
  return (
    <div>
      <HomePage userData={userData} />
    </div>
  );
}
