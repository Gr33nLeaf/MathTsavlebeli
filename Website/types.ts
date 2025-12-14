
export type ViewState = 'home' | 'archive' | 'materials' | 'tutor' | 'exam' | 'reader';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface ExamYear {
  year: number;
  variants: ExamVariant[];
}

export interface ExamVariant {
  id: string;
  name: string; // e.g., "I ვარიანტი"
  pdfUrl?: string; // Placeholder for real PDF link
  solutionsUrl?: string; // Placeholder
}

export interface Problem {
  question: string;
  solution?: string;
}

export interface Topic {
  id: string;
  title: string;
  content: string; // Summary/Conspect
  problems: Problem[]; // Updated to support solutions
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  topics: Topic[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[]; // For multiple choice
  correctIndex?: number; // For multiple choice
  type: 'multiple_choice' | 'open';
  correctAnswerText?: string; // For open questions (to show after answering)
}
