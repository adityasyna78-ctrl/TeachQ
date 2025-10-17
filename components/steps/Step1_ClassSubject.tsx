
import React from 'react';
import { PaperData } from '../../types';
import { CLASSES, SUBJECTS_BY_CLASS } from '../../constants';

interface Props {
  onNext: () => void;
  updatePaperData: (updates: Partial<PaperData>) => void;
  paperData: PaperData;
}

export const Step1_ClassSubject: React.FC<Props> = ({ onNext, updatePaperData, paperData }) => {
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    const newSubject = SUBJECTS_BY_CLASS[Number(newClass)][0];
    updatePaperData({ class: newClass, subject: newSubject });
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePaperData({ subject: e.target.value });
  };

  const subjects = SUBJECTS_BY_CLASS[Number(paperData.class)] || [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-700">Select Class & Subject</h2>
      <p className="mt-2 text-slate-500">Start by choosing the academic class and subject for the question paper.</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="class" className="block text-sm font-medium text-slate-700">Class</label>
          <select
            id="class"
            name="class"
            value={paperData.class}
            onChange={handleClassChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {CLASSES.map(c => <option key={c} value={c}>{`Class ${c}`}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700">Subject</label>
          <select
            id="subject"
            name="subject"
            value={paperData.subject}
            onChange={handleSubjectChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            disabled={!subjects.length}
          >
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150"
        >
          Next: Select Topics
        </button>
      </div>
    </div>
  );
};
