// src/types.ts

export type StepType = 'info' | 'quiz';

export interface InfoStep {
  type: 'info';
  text: string;
  icon: string;
}

export interface QuizStep {
  type: 'quiz';
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export type Step = InfoStep | QuizStep;

export interface Module {
  id: number;
  title: string;
  emoji: string;
  color: string;
  xp: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeMin: number;
  description: string;
  steps: Step[];
}

// Legacy
export interface Lesson {
  day: number;
  title: string;
  emoji: string;
  color: string;
  xp: number;
  steps: Step[];
}