// src/stores/useAppStore.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Ingredient, FavoriteRecipe } from '../types/index';

interface AppState {
  // 온보딩 완료 여부
  onboardingCompleted: boolean;
  setOnboardingCompleted: (v: boolean) => void;

  // 사용자 프로필
  profile: UserProfile;
  // ★ 수정됨: UserProfile 전체가 아니라 일부(Partial)만 받아도 되도록 변경
  setProfile: (profile: Partial<UserProfile>) => void;

  // 냉장고 재료
  ingredients: string[]; 
  setIngredients: (ingredients: string[]) => void;

  // 찜 목록
  favorites: FavoriteRecipe[];
  addFavorite: (recipe: FavoriteRecipe) => void;
  removeFavorite: (id: string) => void;

  // 전체 초기화
  resetAll: () => void;
}

const initialProfile: UserProfile = {
  id: 0, // ★ userId 저장용 필드 추가
  nickname: '',
  gender: '',
  age: 0,
  height: 0,
  weight: 0,
  diseaseNames: [],
  medications: [],
  cooksAtHome: false, // 초기값 설정 (나중에 true/false로 바뀜)
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboardingCompleted: false,
      setOnboardingCompleted: (v) => set({ onboardingCompleted: v }),

      profile: initialProfile,
      
      // ★ 수정됨: 기존 profile 상태에 새로운 값을 덮어씌우는 방식
      setProfile: (newProfile) => 
        set((state) => ({ profile: { ...state.profile, ...newProfile } })),

      ingredients: [],
      setIngredients: (ingredients) => set({ ingredients }),

      favorites: [],
      addFavorite: (recipe) =>
        set((state) => ({
          favorites: [...state.favorites, recipe],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id), // id 타입 맞춤
        })),

      resetAll: () =>
        set({
          onboardingCompleted: false,
          profile: initialProfile,
          ingredients: [],
          favorites: [],
        }),
    }),
    {
      name: 'health-recipe-storage',
    }
  )
);