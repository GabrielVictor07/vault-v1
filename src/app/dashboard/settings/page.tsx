import { getUserProfile } from "@/app/actions/user";
import SettingsClient from "@/components/SettingsClient";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function SettingsPage() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/login");
  }

  const serializedUser = {
    id: user.id,
    email: user.email,
    plan: user.plan,
    status: user.status,
    createdAt: user.createdAt.toISOString()
  };

  return <SettingsClient user={serializedUser} />;
}
