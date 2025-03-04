'use client';

import { useTranslation } from "react-i18next";
import { useQuickPrompts } from "@/features/prompts/hooks/usePrompts";
import { useVisualStyles } from "@/features/prompts/hooks/useVisualStyles";

export default function SuperboardDashboard() {
  const { t } = useTranslation();
  const { data: quickPrompts } = useQuickPrompts();
  const { data: visualStyles } = useVisualStyles();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">
        {t('superadmin.dashboard.title')}
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Quick Prompts Stats */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            {t('superadmin.dashboard.quickPromptsStats')}
          </h2>
          <div className="text-3xl font-bold text-purple-600">
            {quickPrompts?.length || 0}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {t('superadmin.dashboard.totalQuickPrompts')}
          </p>
        </div>

        {/* Visual Styles Stats */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            {t('superadmin.dashboard.visualStylesStats')}
          </h2>
          <div className="text-3xl font-bold text-pink-600">
            {visualStyles?.length || 0}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {t('superadmin.dashboard.totalVisualStyles')}
          </p>
        </div>
      </div>
    </div>
  );
} 