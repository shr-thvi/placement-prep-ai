
export enum View {
  LANDING = 'LANDING',
  QUIZ = 'QUIZ',
  DASHBOARD = 'DASHBOARD',
  LEARNING_PATH = 'LEARNING_PATH',
  INTERVIEW = 'INTERVIEW',
  MENTOR_MATCH = 'MENTOR_MATCH'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface LearningModule {
  title: string;
  description: string;
  duration: string;
  type: 'lesson' | 'project' | 'quiz';
}

export interface LearningPath {
  role: string;
  modules: LearningModule[];
  careerAdvice: string;
}

export interface InterviewMessage {
  role: 'user' | 'model';
  text: string;
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  advice: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  specialties: string[];
  image: string;
}

export interface UserState {
  name: string;
  targetRole: string;
  quizResults?: {
    score: number;
    answers: number[];
  };
  learningPath?: LearningPath;
}
