import { useClerk, useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuUser, LuLogOut } from "react-icons/lu";
import Link from "next/link";
import { useProfile } from "@/features/users/hooks/useProfile";
import { useLogout } from "@/hooks/useLogout";

export function UserMenu() {
  const { user: clerkUser } = useUser();
  const { user: dbUser } = useProfile(clerkUser?.id);
  const handleLogout = useLogout();

  if (!clerkUser) return null;

  // Utiliser l'image de la base de données si disponible, sinon celle de Clerk
  const imageUrl = dbUser?.imageUrl || clerkUser.imageUrl;
  const displayName = dbUser 
    ? `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim() 
    : clerkUser.fullName;
  const email = clerkUser.primaryEmailAddress?.emailAddress;

  // Créer les initiales à partir du nom affiché
  const initials = displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage src={imageUrl} alt={displayName || ""} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/profile"
            className="flex w-full cursor-pointer items-center gap-2"
          >
            <LuUser className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-2 text-red-600 focus:text-red-600"
        >
          <LuLogOut className="h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 