import { useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface SignOutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function SignOutButton({ variant = 'ghost' }: SignOutButtonProps) {
  const { signOut } = useClerk();

  return (
    <Button
      variant={variant}
      onClick={() => signOut()}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      <span>Déconnexion</span>
    </Button>
  );
} 