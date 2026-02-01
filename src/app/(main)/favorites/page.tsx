'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Heart, Home, Refrigerator, User, 
  Clock, ChevronRight, Flame, ArrowRight
} from 'lucide-react';
import { clsx } from 'clsx';

// --- BottomNav Component (재사용) ---
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

// --- Dummy Data (찜한 레시피들) ---
const INITIAL_FAVORITES = [
  {
    id: 1,
    name: "아보카도 명란 덮밥",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500",
    calories: 480,
    time: "15분",
    tags: ["저염식", "간편식"],
    date: "2024.01.20"
  },
  {
    id: 2,
    name: "닭가슴살 토마토 스튜",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=500",
    calories: 240,
    time: "30분",
    tags: ["다이어트", "고단백"],
    date: "2024.01.18"
  },
  // {
  //   id: 3,
  //   name: "연어 스테이크와 구운 야채",
  //   image: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=500",
  //   calories: 520,
  //   time: "25분",
  //   tags: ["혈관건강", "오메가3"],
  //   date: "2024.01.15"
  // }
];

export default function FavoritesPage() {
  // 상태 관리: 찜 해제(삭제) 기능을 보여주기 위해 state 사용
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  // 찜 해제 핸들러
  const removeFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // 링크 이동 방지
    if (confirm('찜 목록에서 삭제하시겠습니까?')) {
      setFavorites(favorites.filter(item => item.id !== id));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-24 pt-safe-top flex flex-col">
      
      {/* 1. Header */}
      <header className="px-8 py-6 bg-white sticky top-0 z-10 rounded-[32px] shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">찜한 레시피</h1>
        <p className="text-gray-500 text-sm mt-1">
          다시 보고 싶은 메뉴 <span className="text-primary-600 font-bold">{favorites.length}개</span>를 모았어요.
        </p>
      </header>

      {/* 2. Content List */}
      <main className="flex-1 px-6 mt-6">
        <div className="flex flex-col gap-4">
          
          {/* 빈 화면 처리 */}
          {favorites.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Heart size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-700">찜한 레시피가 없어요</h3>
              <p className="text-gray-500 text-sm mb-6">마음에 드는 레시피에 하트를 눌러보세요!</p>
              <Link 
                href="/home" 
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary-700 transition-colors"
              >
                레시피 구경하러 가기 <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* 리스트 아이템 */}
          {favorites.map((recipe) => (
            <div 
              key={recipe.id}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 active:scale-[0.98] transition-transform cursor-pointer group"
            >
              {/* 이미지 */}
              <div className="w-24 h-24 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 relative">
                <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {/* 찜 버튼 (이미지 위에 오버레이) */}
                <button 
                  onClick={(e) => removeFavorite(e, recipe.id)}
                  className="absolute top-1 left-1 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition-transform shadow-sm"
                >
                  <Heart size={14} fill="currentColor" />
                </button>
              </div>

              {/* 정보 */}
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 line-clamp-1 text-lg">{recipe.name}</h3>
                  </div>
                  
                  {/* 태그 */}
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {recipe.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 하단 메타 정보 */}
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {recipe.time}
                  </span>
                  <span className="w-[1px] h-3 bg-gray-300"></span>
                  <span className="flex items-center gap-1 text-orange-500 font-medium">
                    <Flame size={12} /> {recipe.calories}kcal
                  </span>
                </div>
              </div>
              
              {/* 화살표 아이콘 */}
              <div className="flex items-center text-gray-300">
                <ChevronRight size={20} />
              </div>
            </div>
          ))}

        </div>
      </main>

      {/* 3. Bottom Nav */}
      <BottomNav />
    </div>
  );
}
// 'use client';

// import React from 'react';
// import { useAppStore } from '../../../stores/useAppStore';
// import Button from '../../../components/ui/Buttons';
// import { clsx } from 'clsx';

// export default function FavoritesPage() {
//   const { favorites, removeFavorite } = useAppStore();

//   return (
//     <div className="space-y-5 pb-4">
//       <section className="animate-fade-in">
//         <p className="text-body-md text-gray-500">저장한 레시피</p>
//         <p className="text-heading-lg font-bold text-gray-900">{favorites.length}개</p>
//       </section>

//       {favorites.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
//           <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
//             <span className="text-3xl">💙</span>
//           </div>
//           <p className="text-body-lg font-medium text-gray-700 mb-1">찜한 레시피가 없어요</p>
//           <p className="text-body-sm text-gray-400">마음에 드는 레시피를 찜해보세요</p>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {favorites.map((recipe, idx) => (
//             <div
//               key={recipe.id}
//               className={clsx(
//                 'rounded-xl border border-gray-100 bg-white p-4 animate-slide-up'
//               )}
//               style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}
//             >
//               <div className="flex gap-3.5">
//                 <div className="w-[64px] h-[64px] rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0">
//                   <span className="text-2xl">🍽️</span>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-body-lg font-semibold text-gray-900 truncate">{recipe.name}</h3>
//                   <p className="text-body-sm text-gray-500 mt-0.5 truncate">{recipe.description}</p>
//                   <div className="flex items-center gap-2 mt-2">
//                     {recipe.tags.slice(0, 2).map((tag) => (
//                       <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded bg-primary-50 text-primary-600 text-caption font-medium">
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => removeFavorite(recipe.id)}
//                   className="w-8 h-8 flex items-center justify-center rounded-full text-primary-500 hover:bg-error-50 hover:text-error-500 transition-colors flex-shrink-0 self-start"
//                 >
//                   <svg width="18" height="18" viewBox="0 0 22 22" fill="currentColor" stroke="currentColor" strokeWidth="1">
//                     <path d="M19.5 12.572l-7.5 7.428-7.5-7.428A4.5 4.5 0 0 1 11 5.006a4.5 4.5 0 0 1 6.5 7.566z" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )
//       }
//     </div>
//   );
// }