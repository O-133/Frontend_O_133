'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../stores/useAppStore';

export default function RootPage() {
  const router = useRouter();
  const onboardingCompleted = useAppStore((s) => s.onboardingCompleted);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (onboardingCompleted) {
      router.replace('/home');
    } else {
      router.replace('/onboarding/profile');
    }
  }, [isHydrated, onboardingCompleted, router]);

  // 로딩 스플래시
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-elevated">
          <span className="text-3xl">🍳</span>
        </div>
        <h1 className="text-heading-lg text-gradient-primary">맛있는처방</h1>
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mt-2" />
      </div>
    </div>
  );
}