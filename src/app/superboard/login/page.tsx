'use client';

import { SignIn } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";

export default function SuperAdminLogin() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {t('superadmin.login.title')}
          </h1>
          <p className="text-sm text-gray-500">
            {t('superadmin.login.description')}
          </p>
        </div>
        
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600",
              footerActionLink: "text-purple-600 hover:text-purple-700"
            }
          }}
          redirectUrl="/superboard"
        />
      </div>
    </div>
  );
} 