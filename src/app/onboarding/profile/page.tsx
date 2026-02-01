'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../../stores/useAppStore';
import Button from '../../../components/ui/Buttons';
import Input from '../../../components/ui/Input';
import { clsx } from 'clsx';

export default function OnboardingProfilePage() {
  const router = useRouter();
  const { setProfile } = useAppStore();

  const [currentStep, setCurrentStep] = useState(0);

  // 입력값 상태 (Input은 문자열로 처리하는 게 편함)
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'' | 'male' | 'female'>('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // 질병 & 약 상태
  const [hasDisease, setHasDisease] = useState<boolean | null>(null);
  const [diseaseName, setDiseaseName] = useState('');
  const [hasMeds, setHasMeds] = useState<boolean | null>(null);
  const [medicationName, setMedicationName] = useState('');

  const canProceed = () => {
    if (currentStep === 0) {
      return (
        nickname.trim().length >= 2 &&
        gender !== '' &&
        age !== '' &&
        height !== '' &&
        weight !== ''
      );
    }
    if (currentStep === 1) {
      const diseaseCheck = hasDisease !== null && (!hasDisease || (hasDisease && diseaseName.trim() !== ''));
      const medsCheck = hasMeds !== null && (!hasMeds || (hasMeds && medicationName.trim() !== ''));
      return diseaseCheck && medsCheck;
    }
    return false;
  };

  const handleNext = () => {
    if (!canProceed()) return;

    if (currentStep === 0) {
      setCurrentStep(1);
    } else {
      // Step 2 완료 -> Store에 저장 후 다음 페이지로
      // ★ 중요: 여기서 API 스키마에 맞춰 형변환 수행
      setProfile({
        nickname,
        gender, // 백엔드가 "MALE"/"FEMALE"을 원하면 여기서 변환 필요 (일단 소문자 유지)
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        diseaseNames: hasDisease && diseaseName ? [diseaseName] : [],
        medications: hasMeds && medicationName ? [medicationName] : [],
      });
      router.push('/onboarding/ingredients');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const progress = ((currentStep + 1) / 4) * 100;

  return (
    <div className="flex flex-col h-screen bg-white px-6 pb-8 pt-safe-top">
      {/* 상단 네비게이션 */}
      <div className="h-14 flex items-center justify-between mb-2">
        {currentStep > 0 ? (
          <button onClick={handleBack} className="p-2 -ml-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
        ) : <div className="w-10" />}
        <span className="text-gray-400 text-sm">{currentStep + 1} / 4</span>
        <div className="w-10" />
      </div>

      <div className="w-full h-1 bg-gray-100 rounded-full mb-8">
        <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Step 1: 기본 정보 */}
        {currentStep === 0 && (
          <div className="animate-fade-in flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">기본 정보를 입력해주세요</h1>
              <p className="text-gray-500">정확한 분석을 위해 필요해요.</p>
            </div>
            <Input label="닉네임" placeholder="닉네임 입력" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
              <div className="flex gap-3">
                {['male', 'female'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g as 'male' | 'female')}
                    className={clsx(
                      "flex-1 py-3 rounded-xl border-2 font-medium transition-all",
                      gender === g ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-500"
                    )}
                  >
                    {g === 'male' ? '남성' : '여성'}
                  </button>
                ))}
              </div>
            </div>
            <Input label="나이" type="number" placeholder="00" value={age} onChange={(e) => setAge(e.target.value)} unit="세" />
            <Input label="키" type="number" placeholder="000" value={height} onChange={(e) => setHeight(e.target.value)} unit="cm" />
            <Input label="몸무게" type="number" placeholder="00" value={weight} onChange={(e) => setWeight(e.target.value)} unit="kg" />
          </div>
        )}

        {/* Step 2: 건강 정보 */}
        {currentStep === 1 && (
          <div className="animate-fade-in flex flex-col gap-10">
            {/* 질병 */}
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">현재 앓고 있는 질환이 있으신가요?</h1>
              <div className="flex gap-3">
                <button onClick={() => setHasDisease(true)} className={clsx("flex-1 py-4 rounded-xl border-2 font-medium", hasDisease === true ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200")}>네, 있어요</button>
                <button onClick={() => { setHasDisease(false); setDiseaseName(''); }} className={clsx("flex-1 py-4 rounded-xl border-2 font-medium", hasDisease === false ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200")}>아니요</button>
              </div>
              {hasDisease && <div className="animate-slide-up"><Input label="질환명" placeholder="예: 당뇨" value={diseaseName} onChange={(e) => setDiseaseName(e.target.value)} /></div>}
            </div>
            <div className="w-full h-[1px] bg-gray-100" />
            {/* 약 */}
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">현재 복용 중인 약이 있으신가요?</h1>
              <div className="flex gap-3">
                <button onClick={() => setHasMeds(true)} className={clsx("flex-1 py-4 rounded-xl border-2 font-medium", hasMeds === true ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200")}>네, 먹고 있어요</button>
                <button onClick={() => { setHasMeds(false); setMedicationName(''); }} className={clsx("flex-1 py-4 rounded-xl border-2 font-medium", hasMeds === false ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200")}>아니요</button>
              </div>
              {hasMeds && <div className="animate-slide-up"><Input label="약 이름" placeholder="예: 메트포르민" value={medicationName} onChange={(e) => setMedicationName(e.target.value)} /></div>}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 mb-6">
        <Button size="xl" fullWidth onClick={handleNext} disabled={!canProceed()}>다음</Button>
      </div>
    </div>
  );
}