'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../../stores/useAppStore';
import Button from '../../../components/ui/Buttons';
import { Upload, Search, X, ChefHat, Coffee } from 'lucide-react';
import axios from 'axios';

// 기본 재료 리스트 (Step 3에서 사용)
const BASIC_INGREDIENTS = ['계란', '양파', '대파', '마늘', '김치', '두부', '감자', '돼지고기', '간장'];

// 영수증 인식 결과 시뮬레이션 데이터
const RECEIPT_INGREDIENTS = [
  '두부', '달걀', '애호박', '양파', '버섯', '브로콜리', '밥', '햄', '올리브유'
];

// 카테고리 매핑 (표시용)
const CATEGORY_MAP: Record<string, string> = {
  // 정육/계란
  '계란': '정육/계란', '달걀': '정육/계란', '두부': '정육/계란', '돼지고기': '정육/계란', 
  '소고기': '정육/계란', '닭가슴살': '정육/계란', '햄': '정육/계란',
  
  // 채소/과일
  '양파': '채소/과일', '대파': '채소/과일', '마늘': '채소/과일', '김치': '채소/과일', 
  '감자': '채소/과일', '파프리카': '채소/과일', '버섯': '채소/과일', '상추': '채소/과일', 
  '애호박': '채소/과일', '브로콜리': '채소/과일',
  
  // 곡물 (기타 혹은 별도 분류 가능하지만 요청하신 3개 카테고리에 맞춤)
  '밥': '기타', 

  // 소스/양념
  '간장': '소스/양념', '소금': '소스/양념', '후추': '소스/양념', '고추장': '소스/양념', 
  '된장': '소스/양념', '올리브유': '소스/양념',
};

// 화면에 보여줄 카테고리 순서
const CATEGORY_ORDER = ['정육/계란', '채소/과일', '소스/양념', '기타'];

export default function OnboardingIngredientsPage() {
  const router = useRouter();
  const { profile, setProfile, setOnboardingCompleted } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [internalStep, setInternalStep] = useState(0); 
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [cooksAtHome, setCooksAtHome] = useState(false);

  // 뒤로가기 핸들러
  const handleBack = () => {
    if (internalStep === 0) router.back(); 
    else setInternalStep(0);
  };

  // Step 3: 요리 빈도 선택
  const handleFrequencySelect = (freq: 'low' | 'high') => {
    if (freq === 'high') {
      setIngredients([...BASIC_INGREDIENTS]);
      setCooksAtHome(true);
    } else {
      setIngredients([]);
      setCooksAtHome(false);
    }
    setInternalStep(1);
  };

  // 재료 직접 추가
  const addIngredient = () => {
    const trimmedInput = inputText.trim();
    if (trimmedInput && !ingredients.includes(trimmedInput)) {
      setIngredients([trimmedInput, ...ingredients]);
      setInputText('');
    }
  };

  // 재료 삭제
  const removeIngredient = (target: string) => {
    setIngredients(ingredients.filter(item => item !== target));
  };

  // ★ 이미지 업로드 핸들러 (영수증 데이터 자동 입력)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // 실제로는 여기서 이미지를 서버로 보내고 OCR 결과를 받아와야 함.
      // 현재는 데모용으로 고정된 영수증 재료 리스트를 추가.
      
      alert('영수증을 분석하여 재료를 추가했습니다!');
      
      // 기존 재료에 영수증 재료를 합치되, 중복 제거
      setIngredients((prev) => Array.from(new Set([...RECEIPT_INGREDIENTS, ...prev])));
      
      // 파일 인풋 초기화 (동일 파일 다시 선택 가능하도록)
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 재료 그룹화 로직
  const getGroupedIngredients = () => {
    const groups: Record<string, string[]> = { '정육/계란': [], '채소/과일': [], '소스/양념': [], '기타': [] };
    ingredients.forEach((ing) => {
      const category = CATEGORY_MAP[ing] || '기타';
      if (groups[category]) {
        groups[category].push(ing);
      } else {
        groups['기타'].push(ing);
      }
    });
    return groups;
  };

  // ★ API 호출 및 완료 처리
  const handleAnalyze = async () => {
    try {
      // 1. 회원가입 API 호출
      const signupBody = {
        nickname: profile.nickname,
        gender: profile.gender,
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
        diseaseNames: profile.diseaseNames,
        medications: profile.medications,
        cooksAtHome: cooksAtHome,
      };

      console.log('1. 유저 생성 요청:', signupBody);
      const userResponse = await axios.post('http://3.36.62.22:8080/api/v1/users/guest', signupBody);
      console.log('2. 유저 생성 응답:', userResponse.data);

      const userId = userResponse.data.data?.id;

      if (!userId) {
        throw new Error('응답에서 User ID를 찾을 수 없습니다.');
      }

      console.log('3. 추출된 User ID:', userId);

      // 2. 냉장고 재료 등록 API 호출
      if (ingredients.length > 0) {
        const fridgeBody = {
          ingredientNames: ingredients 
        };
        console.log('4. 냉장고 등록 요청:', fridgeBody);
        await axios.post(`http://3.36.62.22:8080/api/v1/fridge/${userId}`, fridgeBody);
      }

      // 3. Store 저장 및 이동
      setProfile({ ...profile, id: userId, cooksAtHome });
      setOnboardingCompleted(true);
      
      router.replace('/home');

    } catch (error) {
      console.error('API Error:', error);
      alert('서버 통신 중 오류가 발생했습니다. (데모 모드 진입)');
      
      // 에러 시에도 데모 진행
      setProfile({ ...profile, id: 9999, cooksAtHome });
      setOnboardingCompleted(true);
      router.replace('/home');
    }
  };

  const groupedIngredients = getGroupedIngredients();
  const currentTotalStep = internalStep === 0 ? 3 : 4;
  const progress = (currentTotalStep / 4) * 100;

  return (
    <div className="flex flex-col h-screen bg-white px-6 pb-8 pt-safe-top">
      {/* 상단 네비게이션 */}
      <div className="h-14 flex items-center justify-between mb-2">
        <button onClick={handleBack} className="p-2 -ml-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <span className="text-gray-400 text-sm">{currentTotalStep} / 4</span>
        <div className="w-10" />
      </div>

      <div className="w-full h-1 bg-gray-100 rounded-full mb-8">
        <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      
      {/* Step 3: 요리 빈도 */}
      {internalStep === 0 && (
        <div className="animate-fade-in flex flex-col h-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">집에서 요리를 자주 하시나요?</h1>
            <p className="text-gray-500">빈도에 따라 기본 재료를 준비해드릴게요.</p>
          </div>
          <div className="flex flex-col gap-4">
            <button onClick={() => handleFrequencySelect('low')} className="p-6 rounded-2xl border-2 border-gray-100 hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center gap-4 text-left group">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 group-hover:bg-white"><Coffee size={24} /></div>
              <div><div className="font-bold text-lg text-gray-900">주 2회 이하</div><div className="text-sm text-gray-500">냉장고가 가벼워요</div></div>
            </button>
            <button onClick={() => handleFrequencySelect('high')} className="p-6 rounded-2xl border-2 border-gray-100 hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center gap-4 text-left group">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 group-hover:bg-white"><ChefHat size={24} /></div>
              <div><div className="font-bold text-lg text-gray-900">주 3회 이상</div><div className="text-sm text-gray-500">기본적인 식재료가 있어요</div></div>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: 재료 등록 */}
      {internalStep === 1 && (
        <div className="animate-fade-in flex flex-col h-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">냉장고 속 재료를<br />알려주세요</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              식재료 구매 목록이나 영수증 사진을 올리시면<br/>
              <span className="text-primary-600 font-bold">더 간편하고 빠르게</span> 재료를 추가할 수 있어요.
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            <div className="flex-1 h-[52px] border border-gray-300 rounded-xl px-3 flex items-center bg-white focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500">
              <Search size={20} className="text-gray-400 mr-2" />
              <input className="w-full h-full outline-none text-base bg-transparent" placeholder="재료명 직접 입력" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addIngredient()} />
              <button onClick={addIngredient} className="text-sm font-bold text-primary-600 ml-2 whitespace-nowrap">추가</button>
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="w-[52px] h-[52px] bg-gray-900 text-white rounded-xl flex items-center justify-center active:scale-95 transition-transform">
              <Upload size={24} />
            </button>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          </div>

          <div className="flex-1 overflow-y-auto content-start pb-4">
            {ingredients.length === 0 && (
              <div className="w-full h-40 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                <span>냉장고가 비었어요!</span>
                <span className="text-sm mt-1">위 버튼으로 재료를 추가해보세요.</span>
              </div>
            )}
            {/* 카테고리별 재료 렌더링 */}
            {ingredients.length > 0 && CATEGORY_ORDER.map((category) => {
              const items = groupedIngredients[category];
              if (items.length === 0) return null;
              return (
                <div key={category} className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 px-1">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((ing, idx) => (
                      <button key={`${category}-${ing}-${idx}`} onClick={() => removeIngredient(ing)} className="h-9 px-3 bg-primary-50 text-primary-700 rounded-full text-sm font-medium flex items-center gap-1 border border-primary-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors group">
                        {ing} <X size={14} className="text-primary-400 group-hover:text-red-400" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 mb-6">
            <Button size="xl" fullWidth onClick={handleAnalyze}>분석하고 레시피 추천받기</Button>
          </div>
        </div>
      )}
    </div>
  );
}