import { getUserProfile } from "@/app/actions/user";
import ProfileClient from "@/components/ProfileClient";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function ProfilePage() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/login");
  }

  // Sanitiza para garantir que seja serializável para o componente cliente
  const serializedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    nickname: user.nickname,
    phone: user.phone,
    image: user.image,
    plan: user.plan,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
    lastSignIn: user.lastSignIn ? user.lastSignIn.toISOString() : null
  };

  return <ProfileClient initialUser={serializedUser} />;
}
