import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona para a rota de autenticação secreta do Admin
  redirect("/vault-master-auth");
}
