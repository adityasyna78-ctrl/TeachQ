
import React from 'react';
import { PaperData, Question, Paper, AnswerKeyItem } from '../types';

interface PaperPreviewProps {
  paperData: PaperData;
  mode: 'question' | 'answer';
}

const renderQuestion = (q: Question, index: number) => {
    return (
      <div key={q.id} className="mb-4">
        <div className="flex justify-between items-baseline">
          <p className="font-bold">{`Q${index + 1}. ${q.question_text}`}</p>
          <p className="text-sm font-semibold">{`(${q.marks} mark${q.marks > 1 ? 's' : ''})`}</p>
        </div>
        {q.type === 'MCQ' && q.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-2">
            {q.options.map((opt, i) => (
              <p key={i} className="text-sm">{`${String.fromCharCode(65 + i)}) ${opt}`}</p>
            ))}
          </div>
        )}
      </div>
    );
};

const renderAnswer = (q: Question, answer: AnswerKeyItem | undefined, index: number) => {
  if (!answer) return null;
  return (
    <div key={q.id} className="mb-4 pb-2 border-b border-gray-200 last:border-b-0">
        <p className="font-bold">{`Q${index + 1}:`} <span className="font-normal">{q.question_text}</span></p>
        <p className="mt-1"><strong>Answer:</strong> {answer.answer}</p>
        {q.solution && <p className="text-sm mt-1 text-gray-600"><strong>Solution:</strong> {q.solution}</p>}
    </div>
  )
}


export const PaperPreview: React.FC<PaperPreviewProps> = ({ paperData, mode }) => {
  const { branding, generatedPaper } = paperData;
  const paper: Paper | null = generatedPaper;

  const totalMarks = paper?.paper_meta.total_marks || paperData.branding.totalMarks;

  return (
    <div id="print-area" className="p-8 border border-gray-300 bg-white shadow-lg rounded-lg max-w-4xl mx-auto" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <header className="border-b-2 border-black pb-4">
        <div className="flex justify-between items-center">
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt="School Logo" className="h-20 w-20 object-contain" />
          ) : (
            <div className="h-20 w-20 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">No Logo</div>
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold">{branding.schoolName}</h1>
            <h2 className="text-lg font-semibold">{branding.examName}</h2>
            {mode === 'answer' && <h3 className="text-md font-semibold text-red-600">ANSWER KEY & SOLUTIONS</h3>}
          </div>
          <div className="w-20"></div> {/* Spacer */}
        </div>
        <div className="flex justify-between mt-4 text-sm font-semibold">
          <span>Class: {paper?.paper_meta.class || paperData.class}</span>
          <span>Subject: {paper?.paper_meta.subject || paperData.subject}</span>
          <span>Date: {branding.date}</span>
          <span>Max. Marks: {totalMarks}</span>
          <span>Duration: {branding.duration}</span>
        </div>
      </header>

      <main className="mt-6">
        {paper ? (
            mode === 'question' ? (
                paper.questions.map((q, i) => renderQuestion(q, i))
            ) : (
                paper.questions.map((q, i) => renderAnswer(q, paper.answer_key.find(a => a.id === q.id), i))
            )
        ) : (
            <div className="text-center text-gray-500 py-10">
                <p>Question paper content will be displayed here once generated.</p>
            </div>
        )}
      </main>

      <footer className="mt-8 pt-4 border-t border-gray-300 text-center text-xs">
        <p>{branding.footerNote}</p>
        <p className="mt-2">Page 1 of 1</p>
      </footer>
    </div>
  );
};
