import { redirect } from "next/navigation";

export default async function Home() {
  return <div>{redirect("/home")}</div>;
}
