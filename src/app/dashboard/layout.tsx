import { Sidebar } from "@/components/Sidebar";
import { getUserProfile } from "@/app/actions/user";
import { redirect } from "next/navigation";
import { getSystemConfig } from "@/app/actions/system";
import { TopbarClient } from "@/components/TopbarClient";
import { FreeAccessBlocker } from "@/components/FreeAccessBlocker";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, config] = await Promise.all([
    getUserProfile(),
    getSystemConfig()
  ]);

  if (config?.maintenanceMode) {
    redirect("/maintenance");
  }

  if (!user) {
    redirect("/login");
  }

  // Se o usuário estiver no plano free, bloqueia o acesso e mostra a tela de checkout
  if (user.plan?.toLowerCase() === "free") {
    return (
      <FreeAccessBlocker 
        email={user.email} 
        checkoutUrl={config?.checkoutUrl || "https://checkout.cakto.com.br/vault-premium"} 
      />
    );
  }

  const displayName = user.name || user.email.split("@")[0] || "Usuário";
  const displayPlan = user.plan?.toLowerCase() === "free" ? "Plano Free" : "Acesso Vitalício";

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative">
        {/* Decorative Background Elements */}
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Topbar Client */}
        <TopbarClient displayName={displayName} displayPlan={displayPlan} />

        {/* Content */}
        <main className="flex-1 p-10 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
