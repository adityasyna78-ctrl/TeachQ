
import React, { useState, useMemo } from 'react';
import { PaperData } from '../../types';
import { SYLLABUS } from '../../constants';

interface Props {
  onNext: () => void;
  onBack: () => void;
  updatePaperData: (updates: Partial<PaperData>) => void;
  paperData: PaperData;
}

export const Step2_TopicSelection: React.FC<Props> = ({ onNext, onBack, updatePaperData, paperData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const allTopics = SYLLABUS[Number(paperData.class)]?.[paperData.subject] || [];

  const handleTopicToggle = (topic: string) => {
    const newSelectedTopics = paperData.selectedTopics.includes(topic)
      ? paperData.selectedTopics.filter(t => t !== topic)
      : [...paperData.selectedTopics, topic];
    updatePaperData({ selectedTopics: newSelectedTopics });
  };

  const handleSelectAll = () => {
    if (paperData.selectedTopics.length === allTopics.length) {
      updatePaperData({ selectedTopics: [] }); // Deselect all
    } else {
      updatePaperData({ selectedTopics: allTopics }); // Select all
    }
  };

  const filteredTopics = useMemo(() => 
    allTopics.filter(topic => topic.toLowerCase().includes(searchTerm.toLowerCase())),
    [allTopics, searchTerm]
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-700">Topic Selection (NCERT)</h2>
      <p className="mt-2 text-slate-500">Choose the chapters and topics to include. All topics are aligned with the NCERT syllabus.</p>

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {paperData.selectedTopics.length === allTopics.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        
        <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTopics.length > 0 ? filteredTopics.map(topic => (
            <div key={topic} className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={topic}
                  name="topics"
                  type="checkbox"
                  checked={paperData.selectedTopics.includes(topic)}
                  onChange={() => handleTopicToggle(topic)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={topic} className="font-medium text-gray-700">{topic}</label>
              </div>
            </div>
          )) : (
            <p className="text-slate-500 col-span-full text-center">No topics found for your search.</p>
          )}
        </div>
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
          disabled={paperData.selectedTopics.length === 0}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          Next: Define Structure
        </button>
      </div>
    </div>
  );
};
