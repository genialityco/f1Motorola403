export type GameScreen = 'start' | 'playing' | 'finished';

export type ResultType = 'success' | 'timeout';

export interface Category {
  id: string;
  name: string;
  color: string;
  selectionImage: string;
  selectionImageAlt: string;
  unselectedImage: string;
  unselectedImageAlt: string;
  gameImage: string;
  gameImageAlt: string;
  panelBackground?: string;
}

export interface GameWord {
  id: string;
  name: string;
  categoryId: string;
}

export interface TimerConfig {
  durationMilliseconds: number;
  backgroundMedia: string;
  backgroundMediaAlt: string;
}

export interface LayoutConfig {
  header: {
    leftImage: string;
    leftImageAlt: string;
    rightImage: string;
    rightImageAlt: string;
  };
  backgroundVideo: string;
  backgroundOverlayOpacity: number;
}

export interface IntroConfig {
  image: string;
  imageAlt: string;
  text: string;
  cardBackground?: string;
}

export interface StartButtonConfig {
  text: string;
  activeMedia: string;
  activeMediaAlt: string;
  disabledMedia: string;
  disabledMediaAlt: string;
}

export interface ResultConfig {
  successTitle: string;
  successMessage: string;
  successImage: string;
  successImageAlt: string;
  timeoutTitle: string;
  timeoutMessage: string;
  timeoutImage: string;
  timeoutImageAlt: string;
}

export interface GridConfig {
  totalWords: number;
}

export interface GameData {
  layout: LayoutConfig;
  intro: IntroConfig;
  startButton: StartButtonConfig;
  timer: TimerConfig;
  result: ResultConfig;
  grid: GridConfig;
  categories: Category[];
  words: GameWord[];
}

export interface GameStateSnapshot {
  screen: GameScreen;
  selectedCategoryId: string | null;
  selectedWordIds: string[];
  result: ResultType | null;
}
