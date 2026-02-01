// 사용자 프로필 (백엔드 Schema와 일치 + id 추가)
export interface UserProfile {
  id: number; // ★ 추가됨: 백엔드에서 받는 User ID (필수)
  nickname: string;
  gender: string; 
  age: number;    
  height: number; 
  weight: number; 
  diseaseNames: string[]; 
  medications: string[];
  cooksAtHome: boolean; 
}

// 재료 (백엔드 응답 스키마와 일치시킴)
export interface Ingredient {
  ingredientId: number;   // 기존 id: string -> ingredientId: number
  ingredientName: string; // 기존 name: string -> ingredientName: string
  createdAt?: string;     // 선택적 속성
}

// 카테고리 (프론트엔드 UI용, 그대로 유지)
export type IngredientCategory =
  | '채소'
  | '과일'
  | '육류'
  | '해산물'
  | '유제품'
  | '곡물'
  | '양념/소스'
  | '기타';

// 추천 레시피 (기존 유지)
export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  cookingTime: number; 
  difficulty: '쉬움' | '보통' | '어려움';
  tags: string[];
  ingredients: string[];
  matchRate: number; 
}

// 찜한 레시피 (기존 유지)
export interface FavoriteRecipe {
  id: number;
  name: string;
  image: string;
  calories: number;
  time: string;
  tags: string[];
  savedAt: string;
}