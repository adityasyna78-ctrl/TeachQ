
import React, { useEffect } from 'react';
import { PaperData, PaperStructure } from '../../types';

interface Props {
  onNext: () => void;
  onBack: () => void;
  updatePaperData: (updates: Partial<PaperData>) => void;
  paperData: PaperData;
}

const NumberInput: React.FC<{label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <input
            type="number"
            value={value}
            onChange={onChange}
            min="0"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);

export const Step3_PaperStructure: React.FC<Props> = ({ onNext, onBack, updatePaperData, paperData }) => {
  const { structure } = paperData;

  const handleStructureChange = (field: keyof PaperStructure, value: number) => {
    updatePaperData({ structure: { ...structure, [field]: value } });
  };

  const totalQuestions = structure.mcqCount + structure.shortCount + structure.longCount;
  const totalMarks = (structure.mcqCount * structure.mcqMarks) + (structure.shortCount * structure.shortMarks) + (structure.longCount * structure.longMarks);

  useEffect(() => {
    if (totalQuestions !== structure.totalQuestions) {
        handleStructureChange('totalQuestions', totalQuestions);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalQuestions]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-700">Define Paper Structure</h2>
      <p className="mt-2 text-slate-500">Specify the number of questions for each type and the marks they carry.</p>

      <div className="mt-8 space-y-6">
        <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800">Multiple Choice Questions (MCQ)</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
                <NumberInput label="Number of Questions" value={structure.mcqCount} onChange={(e) => handleStructureChange('mcqCount', parseInt(e.target.value, 10) || 0)} />
                <NumberInput label="Marks per Question" value={structure.mcqMarks} onChange={(e) => handleStructureChange('mcqMarks', parseInt(e.target.value, 10) || 0)} />
            </div>
        </div>

        <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800">Short Answer Questions</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
                <NumberInput label="Number of Questions" value={structure.shortCount} onChange={(e) => handleStructureChange('shortCount', parseInt(e.target.value, 10) || 0)} />
                <NumberInput label="Marks per Question" value={structure.shortMarks} onChange={(e) => handleStructureChange('shortMarks', parseInt(e.target.value, 10) || 0)} />
            </div>
        </div>

        <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800">Long Answer Questions</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
                <NumberInput label="Number of Questions" value={structure.longCount} onChange={(e) => handleStructureChange('longCount', parseInt(e.target.value, 10) || 0)} />
                <NumberInput label="Marks per Question" value={structure.longMarks} onChange={(e) => handleStructureChange('longMarks', parseInt(e.target.value, 10) || 0)} />
            </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-slate-100 rounded-lg flex justify-around font-bold text-lg">
        <span>Total Questions: <span className="text-indigo-600">{totalQuestions}</span></span>
        <span>Total Marks: <span className="text-indigo-600">{totalMarks}</span></span>
      </div>

      <div className="mt-10 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 transition duration-150"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={totalQuestions === 0 || totalMarks === 0}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          Next: Add Branding
        </button>
      </div>
    </div>
  );
};
