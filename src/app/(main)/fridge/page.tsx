'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Plus, X, Search, Upload, 
  Home, Refrigerator, Heart, User, ChefHat 
} from 'lucide-react';
import { clsx } from 'clsx';
import Button from '../../../components/ui/Buttons';
import { useAppStore } from '../../../stores/useAppStore';
import axios from 'axios';

// --- Constants (카테고리 매핑) ---
const CATEGORY_MAP: Record<string, string> = {
  // 정육/계란
  '계란': '정육/계란', '달걀': '정육/계란', '두부': '정육/계란', '돼지고기': '정육/계란', 
  '소고기': '정육/계란', '닭가슴살': '정육/계란', '햄': '정육/계란', '베이컨': '정육/계란',
  
  // 채소/과일
  '양파': '채소/과일', '대파': '채소/과일', '마늘': '채소/과일', '김치': '채소/과일', '감자': '채소/과일', 
  '파프리카': '채소/과일', '버섯': '채소/과일', '상추': '채소/과일', '애호박': '채소/과일', 
  '당근': '채소/과일', '브로콜리': '채소/과일', '오이': '채소/과일', '고구마': '채소/과일',
  
  // 소스/양념
  '간장': '소스/양념', '소금': '소스/양념', '후추': '소스/양념', '고추장': '소스/양념', 
  '된장': '소스/양념', '올리브유': '소스/양념', '참기름': '소스/양념', '설탕': '소스/양념', 
  '마요네즈': '소스/양념', '케첩': '소스/양념',

  // 기타
  '밥': '기타', '쌀': '기타', '빵': '기타', '우유': '기타', '치즈': '기타'
};

const CATEGORY_ORDER = ['정육/계란', '채소/과일', '소스/양념', '기타'];

// --- ★ PRE-LOADED DATA (영수증 인식 결과 반영) ---
const INITIAL_FRIDGE_DATA: ServerIngredient[] = [
  { ingredientId: 101, ingredientName: '두부', createdAt: '2026-02-01' },
  { ingredientId: 102, ingredientName: '달걀', createdAt: '2026-02-01' },
  { ingredientId: 103, ingredientName: '햄', createdAt: '2026-02-01' },
  { ingredientId: 104, ingredientName: '애호박', createdAt: '2026-02-01' },
  { ingredientId: 105, ingredientName: '양파', createdAt: '2026-02-01' },
  { ingredientId: 106, ingredientName: '버섯', createdAt: '2026-02-01' },
  { ingredientId: 107, ingredientName: '브로콜리', createdAt: '2026-02-01' },
  { ingredientId: 108, ingredientName: '올리브유', createdAt: '2026-02-01' },
  { ingredientId: 109, ingredientName: '밥', createdAt: '2026-02-01' },
];

// --- Types ---
interface ServerIngredient {
  ingredientId: number;
  ingredientName: string;
  createdAt: string;
}

// --- BottomNav ---
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
      {navItems.map((item) => (
        <Link key={item.label} href={item.path} className="flex flex-col items-center gap-1 min-w-[60px]">
          <item.icon size={24} className={isActive(pathname, item.path) ? "text-primary-600" : "text-gray-300"} strokeWidth={isActive(pathname, item.path) ? 2.5 : 2} />
          <span className={clsx("text-[10px] font-medium", isActive(pathname, item.path) ? "text-primary-600" : "text-gray-300")}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};
const isActive = (current: string, path: string) => current === path;

export default function FridgePage() {
  const { profile } = useAppStore();
  
  // ★ 초기값으로 영수증 데이터를 넣어둠
  const [ingredients, setIngredients] = useState<ServerIngredient[]>(INITIAL_FRIDGE_DATA);
  const [isAdding, setIsAdding] = useState(false);
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. 초기 데이터 로드 (서버와 동기화)
  const fetchIngredients = async () => {
    if (!profile.id) return;
    try {
      // 실제 API가 연결되어 있고 데이터가 있다면 받아온 데이터로 덮어씌움
      // (데모 시연을 위해, 서버 데이터가 비어있을 땐 초기 영수증 데이터 유지)
      const response = await axios.get(`http://3.36.62.22:8080/api/v1/fridge/${profile.id}`);
      if (response.data.data && response.data.data.length > 0) {
        setIngredients(response.data.data); 
      }
    } catch (error) {
      console.error('재료 로드 실패 (데모 모드 유지):', error);
    }
  };

  useEffect(() => {
    // API 호출은 하되, 실패하거나 데이터가 없으면 INITIAL_FRIDGE_DATA가 유지됨
    fetchIngredients();
  }, [profile.id]);

  // 2. 재료 추가 (POST - Names)
  const addIngredient = async () => {
    const name = inputText.trim();
    if (!name) return;
    
    // 중복 체크 (이름 기준)
    if (ingredients.some(i => i.ingredientName === name)) {
      alert('이미 등록된 재료입니다.');
      setInputText('');
      return;
    }

    // 낙관적 업데이트 (UI 먼저 추가)
    const tempId = Date.now();
    const newIngredient = { ingredientId: tempId, ingredientName: name, createdAt: new Date().toISOString() };
    setIngredients(prev => [newIngredient, ...prev]);
    setInputText('');

    if (profile.id) {
      try {
        await axios.post(`http://3.36.62.22:8080/api/v1/fridge/${profile.id}`, {
          ingredientNames: [name]
        });
        fetchIngredients(); // 서버 ID 동기화를 위해 재호출
      } catch (error) {
        console.error('재료 추가 실패:', error);
        // 실패 시 롤백 로직은 생략 (데모용)
      }
    }
  };

  // 3. 재료 삭제 (POST - Delete with IDs)
  const removeIngredient = async (id: number) => {
    // 낙관적 업데이트 (UI 먼저 삭제)
    setIngredients(prev => prev.filter(item => item.ingredientId !== id));

    if (profile.id) {
      try {
        await axios.post(`http://3.36.62.22:8080/api/v1/fridge/${profile.id}/delete`, {
          ingredientIds: [id]
        });
      } catch (error) {
        console.error('재료 삭제 실패:', error);
      }
    }
  };

  // 4. 이미지 업로드 (추가용)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      alert('추가 영수증을 분석했습니다! (파프리카, 쌈장 추가됨)');
      const newItems = ['파프리카', '쌈장'];
      
      // UI 업데이트
      const addedIngredients = newItems.map((name, idx) => ({
        ingredientId: Date.now() + idx,
        ingredientName: name,
        createdAt: new Date().toISOString()
      }));
      setIngredients(prev => [...addedIngredients, ...prev]);

      // API 호출
      if (profile.id) {
         axios.post(`http://3.36.62.22:8080/api/v1/fridge/${profile.id}`, {
           ingredientNames: newItems
         });
      }
    }
  };

  // 5. 카테고리 그룹화 로직
  const getGroupedIngredients = () => {
    const groups: Record<string, ServerIngredient[]> = {
      '정육/계란': [], '채소/과일': [], '소스/양념': [], '기타': []
    };

    ingredients.forEach((ing) => {
      const category = CATEGORY_MAP[ing.ingredientName] || '기타';
      if (groups[category]) {
        groups[category].push(ing);
      } else {
        groups['기타'].push(ing);
      }
    });

    return groups;
  };

  const groupedIngredients = getGroupedIngredients();

  return (
    <div className="bg-white min-h-screen px-2 pt-8 pb-24 pt-safe-top flex flex-col">
      <header className="px-6 py-6 flex items-end justify-between bg-white sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">나의 냉장고</h1>
          <p className="text-gray-500 text-sm mt-1">
            현재 <span className="text-primary-600 font-bold">{ingredients.length}개</span>의 재료가 있어요.
          </p>
        </div>
        <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
          <ChefHat size={20} />
        </div>
      </header>

      <main className="flex-1 px-6 overflow-y-auto">
        <div className="flex flex-col content-start min-h-[200px] pb-4">
          
          {/* 빈 화면 */}
          {ingredients.length === 0 && !isAdding && (
            <div className="w-full h-60 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50 mt-4">
              <Refrigerator size={48} className="mb-2 opacity-50" />
              <span>냉장고가 텅 비었어요</span>
              <span className="text-sm mt-1">아래 버튼을 눌러 채워보세요!</span>
            </div>
          )}

          {/* 카테고리별 리스트 렌더링 */}
          {ingredients.length > 0 && CATEGORY_ORDER.map((category) => {
            const items = groupedIngredients[category];
            if (items.length === 0) return null;

            return (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3 px-1">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((ing) => (
                    <div
                      key={ing.ingredientId}
                      className="group animate-fade-in flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:border-red-200 hover:bg-red-50 transition-all"
                    >
                      <span className="text-gray-700 font-medium group-hover:text-red-500 text-sm">
                        {ing.ingredientName}
                      </span>
                      <button 
                        onClick={() => removeIngredient(ing.ingredientId)}
                        className="text-gray-400 hover:text-red-500 p-0.5 rounded-full"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 하단 입력바 (Floating) */}
      <div className="px-6 pb-6 bg-white">
        {!isAdding ? (
          <Button 
            fullWidth 
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
          >
            <Plus size={20} strokeWidth={3} />
            재료 추가하기
          </Button>
        ) : (
          <div className="animate-slide-up bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-gray-700">새로운 재료 입력</span>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1 h-[50px] bg-white border border-gray-300 rounded-xl px-3 flex items-center focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
                <Search size={18} className="text-gray-400 mr-2" />
                <input 
                  className="w-full h-full outline-none text-base bg-transparent placeholder:text-gray-400"
                  placeholder="예: 계란, 양파"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                  autoFocus
                />
                <button onClick={addIngredient} className="text-sm font-bold text-primary-600 whitespace-nowrap px-2">
                  추가
                </button>
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-[50px] h-[50px] bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                <Upload size={22} />
              </button>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}