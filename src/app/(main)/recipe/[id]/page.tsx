'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, Clock, CheckCircle2, 
  AlertCircle, Share2, Heart, Check 
} from 'lucide-react';
import { clsx } from 'clsx';
import Button from '../../../../components/ui/Buttons';
import { useAppStore } from '../../../../stores/useAppStore';
import axios from 'axios';

// --- ★ PERSONA DETAIL DUMMY DATA (총 8개) ---
const PERSONA_DETAILS: Record<number, any> = {
  // === [다이어트 식단] ===
  101: {
    id: 101,
    name: "닭가슴살·오이 클린 샐러드",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
    time: "15분",
    calories: 240,
    servings: "1인분",
    tags: ["다이어트", "체지방감소", "고단백"],
    analysis: {
      matchRate: 85,
      ownedIngredients: ["닭가슴살", "오이", "올리브유"], 
      missingIngredients: ["레몬", "후추"],
      healthBenefits: [
        { title: "체지방 감소", desc: "열량 대비 단백질 비율이 높아 체지방 감량에 유리합니다." },
        { title: "포만감 유지", desc: "단백질과 수분이 포만감을 오래 유지합니다." },
        { title: "혈중 지질 부담 감소", desc: "포화지방 섭취를 크게 줄입니다." }
      ]
    },
    steps: [
      { num: 1, text: "재료 손질: 닭가슴살은 결대로 찢고, 오이는 얇게 슬라이스합니다." },
      { num: 2, text: "담기: 볼에 손질한 닭가슴살과 오이를 담습니다." },
      { num: 3, text: "섞기: 레몬즙과 후추를 뿌려 가볍게 섞어줍니다." },
      { num: 4, text: "마무리: 올리브유를 소량 둘러 완성합니다." }
    ]
  },
  102: {
    id: 102,
    name: "두부·브로콜리 스팀볼",
    image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=600",
    time: "20분",
    calories: 210,
    servings: "1인분",
    tags: ["다이어트", "초저지방", "식물성단백질"],
    analysis: {
      matchRate: 70,
      ownedIngredients: ["두부", "브로콜리", "올리브유"],
      missingIngredients: ["레몬"],
      healthBenefits: [
        { title: "지방 섭취 최소화", desc: "식물성 단백질로 지방 부담이 적습니다." },
        { title: "대사 효율 개선", desc: "체중 감량 중 대사 저하를 예방합니다." },
        { title: "저녁 적합", desc: "위와 심장 부담이 적어 저녁 식사로 좋습니다." }
      ]
    },
    steps: [
      { num: 1, text: "두부 손질: 두부는 깍둑썰기 하여 물기를 제거합니다." },
      { num: 2, text: "브로콜리 찜: 끓는 물이나 찜기에 브로콜리를 살짝 쪄냅니다." },
      { num: 3, text: "담기: 그릇에 두부와 찐 브로콜리를 담습니다." },
      { num: 4, text: "마무리: 올리브유 몇 방울과 레몬즙을 뿌려 완성합니다." }
    ]
  },
  103: {
    id: 103,
    name: "감자·당근 라이트 스프",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600",
    time: "30분",
    calories: 230,
    servings: "1인분",
    tags: ["다이어트", "저자극", "속편한음식"],
    analysis: {
      matchRate: 90,
      ownedIngredients: ["감자", "당근"],
      missingIngredients: ["소금"],
      healthBenefits: [
        { title: "복부 자극 감소", desc: "부드러운 질감으로 장 자극을 최소화합니다." },
        { title: "포만감 대비 열량 효율", desc: "적은 열량으로도 배부름을 느낄 수 있습니다." },
        { title: "체중 감량 안정성", desc: "다이어트 중 설사·복통 위험을 감소시킵니다." }
      ]
    },
    steps: [
      { num: 1, text: "채소 삶기: 감자와 당근을 껍질을 벗겨 푹 삶습니다." },
      { num: 2, text: "으깨기: 삶은 재료를 믹서에 갈거나 곱게 으깹니다." },
      { num: 3, text: "끓이기: 물을 넣어 농도를 조절하며 한소끔 끓여냅니다." },
      { num: 4, text: "간하기: 소금을 아주 약간만 넣어 완성합니다." }
    ]
  },
  104: {
    id: 104,
    name: "바나나·두부 스무스 볼",
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=600",
    time: "10분",
    calories: 250,
    servings: "1인분",
    tags: ["다이어트", "장건강", "아침대용"],
    analysis: {
      matchRate: 80,
      ownedIngredients: ["바나나", "두부"],
      missingIngredients: ["우유"],
      healthBenefits: [
        { title: "장 리듬 안정", desc: "수용성 섬유질이 장 운동을 돕습니다." },
        { title: "폭식 예방", desc: "혈당과 포만감 균형이 좋습니다." },
        { title: "아침 대용", desc: "부담 없는 하루 시작에 적합합니다." }
      ]
    },
    steps: [
      { num: 1, text: "두부 준비: 두부는 끓는 물에 데쳐서 식혀 준비합니다." },
      { num: 2, text: "블렌딩: 바나나, 두부, 우유를 넣고 곱게 갈아줍니다." },
      { num: 3, text: "담기: 볼에 담아 바로 섭취합니다." }
    ]
  },

  // === [질병 관리 - 고지혈증] (NEW) ===
  201: {
    id: 201,
    name: "연어·양배추 스팀 플레이트",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=600",
    time: "25분",
    calories: 360,
    servings: "1인분",
    tags: ["고지혈증", "오메가3", "혈관건강"],
    analysis: {
      matchRate: 88,
      ownedIngredients: ["연어", "양배추", "오이", "올리브유"],
      missingIngredients: ["레몬", "후추"],
      healthBenefits: [
        { title: "콜레스테롤 개선", desc: "오메가-3가 LDL 콜레스테롤 감소에 기여합니다." },
        { title: "혈관 보호", desc: "항염 지방산이 혈관 내 염증을 줄입니다." },
        { title: "포만감 유지", desc: "단백질·채소 조합으로 과식 예방합니다." }
      ]
    },
    steps: [
      { num: 1, text: "연어 손질: 연어를 깨끗이 씻어 물기를 제거하고 밑간을 합니다." },
      { num: 2, text: "양배추 찜: 찜기에 양배추를 깔고 김을 올립니다." },
      { num: 3, text: "연어 스팀: 양배추 위에 연어를 올리고 10분간 쪄냅니다." },
      { num: 4, text: "플레이팅: 접시에 담고 올리브유와 후추를 곁들입니다." }
    ]
  },
  202: {
    id: 202,
    name: "닭가슴살·토마토 샐러드",
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=600",
    time: "15분",
    calories: 330,
    servings: "1인분",
    tags: ["고지혈증", "저지방", "체중관리"],
    analysis: {
      matchRate: 90,
      ownedIngredients: ["닭가슴살", "토마토", "오이", "올리브유"],
      missingIngredients: ["레몬"],
      healthBenefits: [
        { title: "중성지방 관리", desc: "포화지방 섭취를 줄여 혈중 지방 개선을 돕습니다." },
        { title: "체중 관리", desc: "열량 대비 단백질 비율이 높아 체중 관리에 좋습니다." },
        { title: "심혈관 부담 감소", desc: "가벼운 식단으로 심장 부담을 완화합니다." }
      ]
    },
    steps: [
      { num: 1, text: "닭가슴살 찢기: 익힌 닭가슴살을 먹기 좋은 크기로 찢습니다." },
      { num: 2, text: "채소 손질: 토마토와 오이를 한입 크기로 썹니다." },
      { num: 3, text: "섞기: 볼에 모든 재료를 넣고 가볍게 섞습니다." },
      { num: 4, text: "드레싱: 올리브유와 레몬즙으로 마무리합니다." }
    ]
  },
  203: {
    id: 203,
    name: "두부·브로콜리 볶음",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=600",
    time: "20분",
    calories: 310,
    servings: "1인분",
    tags: ["고지혈증", "항산화", "식물성"],
    analysis: {
      matchRate: 85,
      ownedIngredients: ["두부", "브로콜리", "올리브유"],
      missingIngredients: ["마늘"],
      healthBenefits: [
        { title: "LDL 감소", desc: "식물성 단백질이 콜레스테롤 조절에 도움을 줍니다." },
        { title: "항산화", desc: "브로콜리 성분이 산화 스트레스를 감소시킵니다." },
        { title: "지속 가능", desc: "일상 식단으로 부담 없이 즐길 수 있습니다." }
      ]
    },
    steps: [
      { num: 1, text: "두부 손질: 두부를 깍둑썰기 하여 노릇하게 굽습니다." },
      { num: 2, text: "브로콜리 볶기: 팬에 마늘 향을 내고 브로콜리를 볶습니다." },
      { num: 3, text: "두부 추가: 구운 두부를 넣고 함께 볶아냅니다." }
    ]
  },
  204: {
    id: 204,
    name: "현미 닭가슴살 볼",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600",
    time: "30분",
    calories: 420,
    servings: "1인분",
    tags: ["고지혈증", "균형식", "포만감"],
    analysis: {
      matchRate: 80,
      ownedIngredients: ["현미밥", "닭가슴살", "오이"],
      missingIngredients: ["토마토"],
      healthBenefits: [
        { title: "혈당·지질 균형", desc: "급격한 혈당 및 지질 변동을 억제합니다." },
        { title: "포만감 지속", desc: "풍부한 섬유질로 포만감을 오래 유지합니다." },
        { title: "식사 대용", desc: "간편한 외식 대안으로 적합합니다." }
      ]
    },
    steps: [
      { num: 1, text: "현미 준비: 현미밥을 지어 한 김 식힙니다." },
      { num: 2, text: "닭가슴살 익히기: 닭가슴살을 다지거나 잘게 썰어 익힙니다." },
      { num: 3, text: "볼 구성: 밥과 닭가슴살, 다진 채소를 뭉쳐 볼 형태로 만듭니다." }
    ]
  }
};

// 기본 더미 (ID가 없을 경우 Fallback)
const DEFAULT_RECIPE = PERSONA_DETAILS[101];

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { profile } = useAppStore();
  const [activeTab, setActiveTab] = useState<'analysis' | 'recipe'>('analysis');
  const [isLiked, setIsLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // URL ID에 해당하는 레시피 찾기
  const recipeId = Number(params.id);
  const recipeDetail = PERSONA_DETAILS[recipeId] || DEFAULT_RECIPE;

  const handleBack = () => router.back();
  const handleCookingComplete = () => setShowModal(true);

  // 재료 차감 로직 (API 연동 유지)
  const handleConfirmUsage = async () => {
    if (!profile.id) {
      alert('로그인 정보가 없습니다.');
      return;
    }

    try {
      // 1. 내 냉장고 재료 조회 (이름으로 ID 찾기 위해)
      const fridgeResponse = await axios.get(`http://3.36.62.22:8080/api/v1/fridge/${profile.id}`);
      const myIngredients = fridgeResponse.data.data; 

      // 2. 삭제 대상 ID 찾기
      const idsToDelete: number[] = [];
      const targetNames = recipeDetail.analysis.ownedIngredients;

      if (Array.isArray(myIngredients)) {
        myIngredients.forEach((item: any) => {
          if (targetNames.includes(item.ingredientName)) {
            idsToDelete.push(item.ingredientId);
          }
        });
      }

      console.log('삭제할 재료 IDs:', idsToDelete);

      // 3. 실제 삭제 요청
      if (idsToDelete.length > 0) {
        await axios.post(`http://3.36.62.22:8080/api/v1/fridge/${profile.id}/delete`, {
          ingredientIds: idsToDelete
        });
        alert(`${idsToDelete.length}개의 재료가 냉장고에서 차감되었습니다.`);
      } else {
        alert('차감할 재료가 냉장고에 없습니다. (이름이 일치하지 않을 수 있습니다)');
      }

      setShowModal(false);
      router.replace('/home');

    } catch (error) {
      console.error('재료 차감 실패:', error);
      alert('서버 오류로 재료 차감에 실패했습니다. (데모 모드)');
      setShowModal(false);
      router.replace('/home');
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 relative">
      
      {/* 1. Header */}
      <div className="relative w-full h-[300px]">
        <img src={recipeDetail.image} alt={recipeDetail.name} className="w-full h-full object-cover" />
        
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe-top flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
          <button onClick={handleBack} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
              <Share2 size={20} />
            </button>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
                isLiked ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        <div className="absolute -bottom-10 left-4 right-4 bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{recipeDetail.name}</h1>
              <p className="text-gray-500 text-sm">
                {recipeDetail.servings} 기준 <span className="text-gray-300 mx-2">|</span> {recipeDetail.calories}kcal
              </p>
            </div>
            <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
              <Clock size={14} /> {recipeDetail.time}
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap mt-3">
             {recipeDetail.tags.map((tag: string) => (
               <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">#{tag}</span>
             ))}
          </div>
        </div>
      </div>

      <div className="mt-14 px-6">
        
        {/* 2. Tabs */}
        <div className="flex border-b border-gray-100 mb-6">
          <button
            onClick={() => setActiveTab('analysis')}
            className={clsx(
              "flex-1 py-4 text-sm font-bold text-center transition-all relative",
              activeTab === 'analysis' ? "text-primary-600" : "text-gray-400"
            )}
          >
            맞춤 분석
            {activeTab === 'analysis' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('recipe')}
            className={clsx(
              "flex-1 py-4 text-sm font-bold text-center transition-all relative",
              activeTab === 'recipe' ? "text-primary-600" : "text-gray-400"
            )}
          >
            레시피
            {activeTab === 'recipe' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* 3. Content Area */}
        <div className="animate-fade-in">
          
          {/* === [Tab 1] 맞춤 분석 === */}
          {activeTab === 'analysis' && (
            <div className="flex flex-col gap-8">
              <section>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg text-gray-900">재료 현황</h3>
                  <span className="text-primary-600 font-bold text-sm">준비도 {recipeDetail.analysis.matchRate}%</span>
                </div>
                
                <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                   <div 
                     className="h-full bg-primary-500 rounded-full transition-all duration-1000" 
                     style={{ width: `${recipeDetail.analysis.matchRate}%` }} 
                   />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold text-sm">
                      <CheckCircle2 size={16} /> 보유 중인 재료
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recipeDetail.analysis.ownedIngredients.map((ing: string) => (
                        <span key={ing} className="text-sm text-gray-700 bg-white px-2 py-1 rounded shadow-sm">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                     <div className="flex items-center gap-2 mb-3 text-gray-500 font-bold text-sm">
                      <AlertCircle size={16} /> 부족한 재료
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recipeDetail.analysis.missingIngredients.map((ing: string) => (
                        <span key={ing} className="text-sm text-gray-400 bg-white px-2 py-1 rounded shadow-sm line-through decoration-gray-300">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-bold text-lg text-gray-900 mb-4">이 음식이 주는 효과 ✨</h3>
                <div className="flex flex-col gap-3">
                  {recipeDetail.analysis.healthBenefits.map((benefit: any, idx: number) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-3">
                      <div className="mt-1 min-w-[20px] text-primary-500">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{benefit.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {benefit.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* === [Tab 2] 레시피 === */}
          {activeTab === 'recipe' && (
            <div className="flex flex-col gap-6 pb-20">
               {recipeDetail.steps.map((step: any, idx: number) => (
                 <div key={step.num} className="flex gap-4">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center text-sm">
                     {step.num}
                   </div>
                   <div className="flex-1 pt-1">
                     <p className="text-gray-800 leading-relaxed text-[15px]">
                       {step.text.includes(':') ? (
                         <>
                           <span className="font-bold text-gray-900">{step.text.split(':')[0]}:</span>
                           {step.text.split(':')[1]}
                         </>
                       ) : (
                         step.text
                       )}
                     </p>
                   </div>
                 </div>
               ))}
            </div>
          )}

        </div>
      </div>

      {/* 하단 고정 버튼 */}
      {activeTab === 'recipe' && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-40">
          <Button fullWidth size="xl" onClick={handleCookingComplete}>
            요리 완료
          </Button>
        </div>
      )}

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-[28px] shadow-2xl p-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">요리를 완성하셨나요?</h3>
              <p className="text-sm text-gray-500">사용된 재료가 냉장고 목록에서 차감됩니다.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 mb-3 ml-1">차감될 재료</p>
              <div className="flex flex-col gap-2.5">
                {recipeDetail.analysis.ownedIngredients.map((ing: string) => (
                  <div key={ing} className="flex items-center justify-between bg-white px-3 py-2.5 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-gray-700 font-medium">{ing}</span>
                    <div className="text-primary-600 flex items-center gap-1 text-xs font-bold">
                      <Check size={14} strokeWidth={3} />
                      <span>사용됨</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button fullWidth onClick={handleConfirmUsage}>네, 다 먹었어요</Button>
              <button onClick={() => setShowModal(false)} className="w-full h-[52px] rounded-2xl text-gray-500 font-medium hover:bg-gray-50 transition-colors">아니요, 아직이요</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}