import { useTranslation } from "react-i18next";
import { useUser } from "@clerk/nextjs";
import { useLogout } from "@/hooks/useLogout";

export function UserButton() {
  const { t } = useTranslation();
  const { user } = useUser();
  const handleLogout = useLogout();

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <img
          src={user.imageUrl}
          alt={user.fullName || ""}
          className="h-8 w-8 rounded-full"
        />
        <span>{user.fullName || t('header.guest')}</span>
      </button>
    </div>
  );
} 