import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <SignIn
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        elements: {
          rootBox: 'mx-auto w-full',
          card: 'bg-white shadow-none border rounded-lg',
          headerTitle: 'text-gray-900',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 'border-gray-200 text-gray-600 hover:bg-gray-50',
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
          footerActionLink: 'text-blue-600 hover:text-blue-700',
        },
      }}
    />
  );
} 