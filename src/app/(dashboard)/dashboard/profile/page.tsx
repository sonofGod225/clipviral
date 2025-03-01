'use client';

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
  });

  // Initialize form data when user data is loaded
  useState(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
      });
    }
  });

  if (!isLoaded || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update Clerk profile
      await user.update({
        firstName: formData.fullName.split(" ")[0],
        lastName: formData.fullName.split(" ").slice(1).join(" "),
      });

      // Update Supabase profile
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.fullName,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Profil mis à jour avec succès");
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col ">
      <div className="flex-1 overflow-y-auto pb-[100px] sm:pb-[150px]">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 p-4 text-sm text-gray-500 sm:mb-8 sm:p-8">
          <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <span>/</span>
          <span>Mon Profil</span>
        </div>

        <div className="mx-auto w-full max-w-4xl space-y-6 px-4 sm:space-y-8 sm:px-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Mon Profil</h1>
            <p className="mt-2 text-sm text-gray-500">Gérez vos informations personnelles et vos paramètres</p>
          </div>

          {/* Personal Information */}
          <Card className="rounded-xl border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Votre nom complet"
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 sm:p-4"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    value={user.primaryEmailAddress?.emailAddress}
                    disabled
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 sm:p-4"
                  />
                  <p className="text-xs text-gray-500">
                    L'email ne peut pas être modifié ici. Utilisez les paramètres de votre compte pour le modifier.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="rounded-xl border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle>Paramètres du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Crédits disponibles</label>
                <p className="mt-1 text-sm text-gray-900">100 crédits</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Plan</label>
                <p className="mt-1 text-sm text-gray-900">Gratuit</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Membre depuis</label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.createdAt?.toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons Container */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white sm:left-64">
        <div className="mx-auto w-full max-w-4xl px-4 py-3 sm:px-8 sm:py-4">
          <div className="flex items-center justify-between">
            <span className="hidden text-sm text-gray-500 sm:block">Vos informations sont sécurisées</span>
            <div className="flex w-full items-center justify-end gap-3 sm:w-auto sm:gap-4">
              <Link
                href="/dashboard"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:px-6 sm:py-2.5"
              >
                Annuler
              </Link>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-center text-sm font-medium text-white hover:from-purple-700 hover:to-pink-600 sm:w-auto sm:px-6 sm:py-2.5"
              >
                {isLoading ? "Mise à jour..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 