'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  User, Home, Refrigerator, Heart, Settings, 
  ChevronRight, LogOut, RefreshCcw, Bell, Shield 
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../../../stores/useAppStore';

// --- BottomNav Component (공통) ---
const BottomNav = () => {
  const pathname = usePathname();
  const navItems = [
    { label: '홈', icon: Home, path: '/home' },
    { label: '재료관리', icon: Refrigerator, path: '/fridge' },
    { label: '찜목록', icon: Heart, path: '/favorites' },
    { label: '마이', icon: User, path: '/mypage' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 pb-safe-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link key={item.label} href={item.path} className="flex flex-col items-center gap-1 min-w-[60px]">
            <item.icon size={24} className={isActive ? "text-primary-600" : "text-gray-300"} strokeWidth={isActive ? 2.5 : 2} />
            <span className={clsx("text-[10px] font-medium", isActive ? "text-primary-600" : "text-gray-300")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default function MyPage() {
  const router = useRouter();
  const { profile, setOnboardingCompleted } = useAppStore(); // Store에서 프로필 가져오기
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // ★ 시연용 리셋 함수 (매우 중요)
  const handleResetApp = () => {
    if (confirm('앱 데이터를 모두 초기화하고 온보딩으로 돌아갈까요?\n(시연용 기능)')) {
      // 1. 로컬스토리지 클리어
      localStorage.clear();
      // 2. 스토어 상태 초기화 (필요시)
      setOnboardingCompleted(false);
      // 3. 새로고침하며 메인으로 이동
      window.location.href = '/';
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-24 pt-safe-top flex flex-col">
      
      {/* 1. Header */}
      <header className="px-6 py-6 bg-white sticky top-0 z-10 rounded-b-[32px] shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">마이페이지</h1>
        
        {/* 프로필 카드 */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-3xl border-2 border-white shadow-md">
             {profile.gender === 'female' ? '👩🏻' : '👨🏻'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {profile.nickname || '게스트'} 님
              <span className="text-[10px] px-2 py-0.5 bg-primary-600 text-white rounded-full font-medium">LV.1 새싹</span>
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">오늘도 건강한 하루 되세요! 🌱</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings size={24} />
          </button>
        </div>

        {/* 신체 정보 요약 (온보딩 데이터 연동) */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-gray-50 p-3 rounded-2xl text-center">
            <p className="text-xs text-gray-400 mb-1">나이</p>
            <p className="font-bold text-gray-900">{profile.age || 20}세</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-2xl text-center">
            <p className="text-xs text-gray-400 mb-1">키</p>
            <p className="font-bold text-gray-900">{profile.height || 170}cm</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-2xl text-center">
            <p className="text-xs text-gray-400 mb-1">몸무게</p>
            <p className="font-bold text-gray-900">{profile.weight || 60}kg</p>
          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 px-6 flex flex-col gap-4">
        
        {/* 내 건강 카드 */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Heart size={18} className="text-red-500" />
            내 건강 정보
          </h3>
          
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold text-gray-400 mb-2">관리 중인 질환</p>
              <div className="flex flex-wrap gap-2">
                {profile.diseaseNames?.length > 0 ? (
                  profile.diseaseNames.map((d, i) => (
                    <span key={i} className="px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded-lg">
                      {d}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400"> {profile.diseaseNames || "등록된 질환이 없습니다."}</span>
                )}
              </div>
            </div>

            <div className="w-full h-[1px] bg-gray-100" />

            <div>
              <p className="text-xs font-bold text-gray-400 mb-2">복용 중인 약</p>
              <div className="flex flex-wrap gap-2">
                {profile.medications?.length > 0 ? (
                  profile.medications.map((m, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg">
                      {m}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400"> {profile.medications || "등록된 약이 없습니다."}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 메뉴 리스트 */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                <Bell size={16} />
              </div>
              <span className="text-sm font-medium text-gray-900">알림 설정</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
          
          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <Shield size={16} />
              </div>
              <span className="text-sm font-medium text-gray-900">개인정보 처리방침</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>

          {/* 초기화 버튼 (데모용) */}
          <button 
            onClick={handleResetApp}
            className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-red-500 flex items-center justify-center transition-colors">
                <RefreshCcw size={16} />
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-red-600">앱 초기화</span>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-red-300" />
          </button>
        </section>

        <p className="text-center text-xs text-gray-400 mt-4">
          버전 1.0.0 (Hackathon Build)
        </p>
      </main>

      {/* 3. Bottom Nav */}
      <BottomNav />
    </div>
  );
}