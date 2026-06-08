export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  instructions: string[];
  // Spanish translations and enriched Web3 stats
  nameEs?: string;
  bodyPartEs?: string;
  targetEs?: string;
  equipmentEs?: string;
  descriptionEs?: string;
  instructionsEs?: string[];
  solanaStats?: {
    xpReward: number;
    gasSavedEth: string;
    sweatFactor: string;
    solCoachAdvice: string;
  };
  isMockAi?: boolean;
}

export interface Category {
  key: string;
  name: string;
}

export interface CategoriesResponse {
  bodyParts: Category[];
  muscles: Category[];
  equipments: Category[];
}

export interface SearchResponse {
  results: Exercise[];
  totalCount: number;
  isLocalFallback: boolean;
}
