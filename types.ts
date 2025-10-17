
export type QuestionType = "MCQ" | "SHORT" | "LONG" | "NUMERIC";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Question {
  id: string;
  type: QuestionType;
  marks: number;
  difficulty: Difficulty;
  topic: string;
  question_text: string;
  options?: string[];
  correct_answer: string;
  solution?: string;
}

export interface PaperMeta {
  class: string;
  subject: string;
  topics: string[];
  total_questions: number;
  total_marks: number;
}

export interface AnswerKeyItem {
  id: string;
  answer: string;
  marks: number;
}

export interface Paper {
  paper_meta: PaperMeta;
  questions: Question[];
  answer_key: AnswerKeyItem[];
}

export interface Branding {
  schoolName: string;
  logoUrl: string | null;
  examName: string;
  date: string;
  duration: string;
  totalMarks: string;
  footerNote: string;
}

export interface PaperStructure {
  totalQuestions: number;
  mcqCount: number;
  mcqMarks: number;
  shortCount: number;
  shortMarks: number;
  longCount: number;
  longMarks: number;
}

export interface PaperData {
  class: string;
  subject: string;
  selectedTopics: string[];
  structure: PaperStructure;
  branding: Branding;
  generatedPaper: Paper | null;
}
