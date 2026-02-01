'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Refrigerator, Heart, User, Flame, ChevronRight, Sparkles 
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../../../stores/useAppStore';

// --- Types ---
interface Ingredient {
  name: string;
  isOwned: boolean;
}

interface Recipe {
  id: number;
  name: string;
  image: string;
  category: string;
  calories: number;
  matchRate: number;
  healthScore: number;
  effect: string;
  ingredients: Ingredient[];
}

// --- ★ DATA: 다이어트 식단 (기존 4개) ---
const DIET_RECIPES: Recipe[] = [
  {
    id: 101,
    name: "닭가슴살·오이 클린 샐러드",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500",
    category: 'diet',
    calories: 240,
    healthScore: 92,
    matchRate: 85,
    effect: "지방을 최소화한 고단백 저열량 식단",
    ingredients: [
      { name: "닭가슴살", isOwned: true }, { name: "오이", isOwned: true }, 
      { name: "올리브유", isOwned: true }, { name: "레몬", isOwned: false }, { name: "후추", isOwned: false }
    ]
  },
  {
    id: 102,
    name: "두부·브로콜리 스팀볼",
    image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=500",
    category: 'diet',
    calories: 210,
    healthScore: 94,
    matchRate: 70,
    effect: "식물성 단백질 기반 초저지방 식단",
    ingredients: [
      { name: "두부", isOwned: true }, { name: "브로콜리", isOwned: true }, 
      { name: "올리브유", isOwned: true }, { name: "레몬", isOwned: false }
    ]
  },
  {
    id: 103,
    name: "감자·당근 라이트 스프",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=500",
    category: 'diet',
    calories: 230,
    healthScore: 95,
    matchRate: 90,
    effect: "저자극·저열량으로 장 부담을 줄인 식단",
    ingredients: [
      { name: "감자", isOwned: true }, { name: "당근", isOwned: true }, { name: "소금", isOwned: false }
    ]
  },
  {
    id: 104,
    name: "바나나·두부 스무스 볼",
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=500",
    category: 'diet',
    calories: 250,
    healthScore: 93,
    matchRate: 80,
    effect: "장 친화적 재료로 구성된 가벼운 한 끼",
    ingredients: [
      { name: "바나나", isOwned: true }, { name: "두부", isOwned: true }, { name: "우유", isOwned: false }
    ]
  }
];

// --- ★ DATA: 질병 관리 식단 (준호/고지혈증 - 신규 4개) ---
const DISEASE_RECIPES: Recipe[] = [
//   {
//     id: 201,
//     name: "연어·양배추 스팀 플레이트",
//     image: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=500",
//     category: 'disease',
//     calories: 360,
//     healthScore: 95,
//     matchRate: 88,
//     effect: "불포화지방과 식이섬유 중심으로 혈중 지질 개선",
//     ingredients: [
//       { name: "연어", isOwned: true }, { name: "양배추", isOwned: true }, 
//       { name: "오이", isOwned: true }, { name: "올리브유", isOwned: true }, 
//       { name: "레몬", isOwned: false }, { name: "후추", isOwned: false }
//     ]
//   },
  {
    id: 202,
    name: "닭가슴살·토마토 샐러드",
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=500",
    category: 'disease',
    calories: 330,
    healthScore: 92,
    matchRate: 90,
    effect: "저지방 단백질로 지방 섭취 최소화",
    ingredients: [
      { name: "닭가슴살", isOwned: true }, { name: "토마토", isOwned: true }, 
      { name: "오이", isOwned: true }, { name: "올리브유", isOwned: true }, 
      { name: "레몬", isOwned: false }
    ]
  },
  {
    id: 203,
    name: "두부·브로콜리 볶음",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=500",
    category: 'disease',
    calories: 310,
    healthScore: 93,
    matchRate: 85,
    effect: "식물성 단백질 위주의 저지방 식단",
    ingredients: [
      { name: "두부", isOwned: true }, { name: "브로콜리", isOwned: true }, 
      { name: "올리브유", isOwned: true }, { name: "마늘", isOwned: false }
    ]
  },
  {
    id: 204,
    name: "현미 닭가슴살 볼",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=500",
    category: 'disease',
    calories: 420,
    healthScore: 90,
    matchRate: 80,
    effect: "복합 탄수화물 기반 균형 식단",
    ingredients: [
      { name: "현미밥", isOwned: true }, { name: "닭가슴살", isOwned: true }, 
      { name: "오이", isOwned: true }, { name: "토마토", isOwned: false }
    ]
  }
];

// --- BottomNav Component ---
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
            <span className={clsx("text-[10px] font-medium", isActive ? "text-primary-600" : "text-gray-300")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default function HomePage() {
  const { profile } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<'disease' | 'diet'>('disease'); // 질병 관리 기본
  const [sortBy, setSortBy] = useState<'recommend' | 'match' | 'calorie'>('recommend');
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setRecipes([]); // 초기화

      // [1] 다이어트 탭: DIET_RECIPES 더미 사용
      if (activeCategory === 'diet') {
        setTimeout(() => {
          setRecipes(DIET_RECIPES);
          setLoading(false);
        }, 300);
        return;
      }

      // [2] 질병 관리 탭: DISEASE_RECIPES 더미 사용 (API 대신)
      if (activeCategory === 'disease') {
        setTimeout(() => {
          setRecipes(DISEASE_RECIPES);
          setLoading(false);
        }, 300);
        return;
      }
    };

    loadData();
  }, [activeCategory]); // API 호출이 없으므로 profile.id 의존성 제거해도 됨

  // 클라이언트 정렬
  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortBy === 'recommend') return b.healthScore - a.healthScore; // 건강점수 높은순
    if (sortBy === 'match') return b.matchRate - a.matchRate; // 매칭률 높은순
    if (sortBy === 'calorie') return a.calories - b.calories; // 칼로리 낮은순
    return 0;
  });

  return (
    <div className="bg-gray-50 min-h-screen pt-4 pb-24">
      
      {/* 1. Header */}
      <header className="bg-white px-4 pt-safe-top pt-6 pb-6 rounded-[32px] shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6 mt-2">
          <div>
            <p className="text-gray-500 text-sm mb-1">오늘의 맞춤 처방 💊</p>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              <span className="text-primary-600">{profile.nickname || '건강지킴이'}</span>님을 위한<br />
              식단입니다.
            </h1>
          </div>
        </div>

        {/* 2. Category Toggle */}
        <div className="flex p-1 bg-gray-100 rounded-2xl mb-6 relative">
          <div 
            className={clsx(
              "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out",
              activeCategory === 'disease' ? "left-1" : "left-[calc(50%+4px)]"
            )}
          />
          <button
            onClick={() => setActiveCategory('disease')}
            className={clsx(
              "flex-1 py-3 text-sm font-bold z-10 text-center transition-colors relative",
              activeCategory === 'disease' ? "text-primary-600" : "text-gray-400"
            )}
          >
            질병 관리 식단
          </button>
          <button
            onClick={() => setActiveCategory('diet')}
            className={clsx(
              "flex-1 py-3 text-sm font-bold z-10 text-center transition-colors relative",
              activeCategory === 'diet' ? "text-primary-600" : "text-gray-400"
            )}
          >
            다이어트 식단
          </button>
        </div>

        {/* 3. Filter Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'recommend', label: '질병 도움순', icon: Sparkles },
            { id: 'match', label: '있는 재료순', icon: Refrigerator },
            { id: 'calorie', label: '낮은 칼로리순', icon: Flame },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSortBy(chip.id as any)}
              className={clsx(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all",
                sortBy === chip.id 
                  ? "bg-gray-900 text-white border-gray-900" 
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              )}
            >
              <chip.icon size={14} />
              {chip.label}
            </button>
          ))}
        </div>
      </header>

      {/* 4. Recipe List */}
      <main className="px-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
           <h2 className="font-bold text-lg text-gray-900">
             {loading ? '분석 중...' : `추천 레시피 (${sortedRecipes.length})`}
           </h2>
           <span className="text-xs text-gray-400">분석 완료</span>
        </div>

        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"/>
            <p>맞춤 레시피를 찾고 있어요...</p>
          </div>
        )}

        {!loading && sortedRecipes.map((recipe) => (
          <Link href={`/recipe/${recipe.id}`} key={recipe.id} className="block">
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
              
              {/* 상단 정보 */}
              <div className="flex gap-4 mb-4">
                <div className="w-24 h-24 rounded-2xl bg-gray-200 overflow-hidden flex-shrink-0 relative">
                  <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 py-0.5">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{recipe.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-0.5 text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                      <Flame size={12} fill="currentColor" /> {recipe.calories}kcal
                    </span>
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                      건강점수 {recipe.healthScore}
                    </span>
                    <span className="bg-green-100 px-1.5 py-0.5 rounded">
                    {recipe.matchRate}% 일치
                    </span>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-2.5">
                    <p className="text-xs text-primary-700 font-medium leading-relaxed line-clamp-2">
                      💡 {recipe.effect}
                    </p>
                  </div>
                </div>
              </div>

              {/* 하단 재료 */}
              <div>
                <p className="text-xs font-bold text-gray-400 mb-2">필요 재료 확인</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.ingredients.map((ing, idx) => (
                    <span 
                      key={idx}
                      className={clsx(
                        "px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                        ing.isOwned 
                          ? "bg-blue-50 border-blue-100 text-blue-600" 
                          : "bg-gray-50 border-gray-100 text-gray-400 line-through decoration-gray-300"
                      )}
                    >
                      {ing.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-50 flex justify-center">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  레시피 보러가기 <ChevronRight size={12} />
                </span>
              </div>
            </div>
          </Link>
        ))}

        {!loading && sortedRecipes.length === 0 && (
          <div className="text-center py-10 text-gray-400">
             해당하는 레시피가 없어요 😢
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}