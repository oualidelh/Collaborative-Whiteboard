import RoomPage from "@/components/RoomPage";

export default async function Page({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  console.log("id", roomId);

  return <RoomPage roomId={roomId} />;
}
