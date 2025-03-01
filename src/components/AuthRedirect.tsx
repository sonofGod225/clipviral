import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function AuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');

  useEffect(() => {
    if (redirectUrl) {
      // Vérifier que l'URL est relative pour éviter les redirections malveillantes
      if (redirectUrl.startsWith('/')) {
        router.push(redirectUrl);
      } else {
        console.error('Invalid redirect URL:', redirectUrl);
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  }, [redirectUrl, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Redirection en cours...</p>
      </div>
    </div>
  );
} 