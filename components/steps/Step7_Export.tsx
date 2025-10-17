
import React, { useState } from 'react';
import { PaperData } from '../../types';
import { PaperPreview } from '../PaperPreview';

interface Props {
  onBack: () => void;
  paperData: PaperData;
  startNewPaper: () => void;
}

export const Step7_Export: React.FC<Props> = ({ onBack, paperData, startNewPaper }) => {
  const [mode, setMode] = useState<'question' | 'answer'>('question');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-700">Export Paper</h2>
            <p className="mt-2 text-slate-500">Preview the final question paper and answer key. Click "Download PDF" to print or save the document.</p>
        </div>
        <div className="flex space-x-2 no-print">
            <button onClick={handlePrint} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-150">
                Download PDF
            </button>
        </div>
      </div>
      
      <div className="mt-8 no-print">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setMode('question')}
              className={`${mode === 'question' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Question Paper
            </button>
            <button
              onClick={() => setMode('answer')}
              className={`${mode === 'answer' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Answer Sheet
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-6">
        <PaperPreview paperData={paperData} mode={mode} />
      </div>

      <div className="mt-10 flex justify-between no-print">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 transition duration-150"
        >
          Back to Editor
        </button>
        <button
          onClick={startNewPaper}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150"
        >
          Create Another Paper
        </button>
      </div>
    </div>
  );
};
