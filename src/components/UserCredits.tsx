'use client';

import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Coins, Crown } from 'lucide-react';

interface UserCreditsProps {
  user: User;
  onUpgrade?: () => void;
}

export function UserCredits({ user, onUpgrade }: UserCreditsProps) {
  const maxCredits = user.plan === 'free' ? 10 : 100;
  const progress = (user.credits / maxCredits) * 100;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">
            {user.plan === 'free' ? 'Plan Gratuit' : 'Plan Premium'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {user.plan === 'free'
              ? 'Passez au plan premium pour plus de crédits'
              : 'Profitez de toutes les fonctionnalités premium'}
          </p>
        </div>
        {user.plan === 'premium' ? (
          <Crown className="h-5 w-5 text-yellow-500" />
        ) : (
          <Coins className="h-5 w-5 text-blue-500" />
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Crédits restants</span>
          <span className="font-medium">
            {user.credits} / {maxCredits}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {user.plan === 'free' && onUpgrade && (
        <div className="mt-6">
          <Button
            onClick={onUpgrade}
            className="w-full"
          >
            Passer au plan premium
          </Button>
        </div>
      )}

      <div className="mt-4">
        <h4 className="text-sm font-medium">Avantages du plan {user.plan === 'free' ? 'premium' : 'actuel'} :</h4>
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
          {user.plan === 'free' ? (
            <>
              <li>• 100 crédits de génération</li>
              <li>• Vidéos en haute qualité</li>
              <li>• Styles visuels exclusifs</li>
              <li>• Voix premium</li>
              <li>• Support prioritaire</li>
            </>
          ) : (
            <>
              <li>• {maxCredits} crédits de génération</li>
              <li>• Vidéos en haute qualité</li>
              <li>• Tous les styles visuels</li>
              <li>• Toutes les voix disponibles</li>
              <li>• Support prioritaire</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
} 