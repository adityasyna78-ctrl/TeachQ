
import { useState, useCallback } from 'react';
import { PaperData } from '../types';

const getInitialState = (): PaperData => ({
  class: '10',
  subject: 'Mathematics',
  selectedTopics: [],
  structure: {
    totalQuestions: 10,
    mcqCount: 5,
    mcqMarks: 1,
    shortCount: 3,
    shortMarks: 2,
    longCount: 2,
    longMarks: 5,
  },
  branding: {
    schoolName: 'Kendriya Vidyalaya',
    logoUrl: null,
    examName: 'Mid-Term Examination',
    date: new Date().toISOString().split('T')[0],
    duration: '90 Minutes',
    totalMarks: '',
    footerNote: 'All questions are compulsory.'
  },
  generatedPaper: null,
});

export const usePaperBuilder = () => {
  const [paperData, setPaperData] = useState<PaperData>(getInitialState());

  const updatePaperData = useCallback((updates: Partial<PaperData>) => {
    setPaperData(prevData => ({ ...prevData, ...updates }));
  }, []);

  const resetPaperData = useCallback(() => {
    setPaperData(getInitialState());
  }, []);

  return { paperData, updatePaperData, resetPaperData };
};
