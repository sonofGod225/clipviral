import { useClerk } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const { signOut } = useClerk();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Invalider tous les caches React Query
      queryClient.removeQueries();
      
      // Déconnexion de Clerk
      await signOut();
      
      // Redirection vers la page d'accueil
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return handleLogout;
}; 