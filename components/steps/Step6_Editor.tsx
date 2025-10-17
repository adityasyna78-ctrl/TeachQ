
import React, { useState } from 'react';
import { PaperData, Paper, Question } from '../../types';
import { EditIcon, DeleteIcon, RefreshIcon } from '../icons';

interface Props {
  onNext: () => void;
  onBack: () => void;
  updatePaperData: (updates: Partial<PaperData>) => void;
  paperData: PaperData;
  startNewPaper: () => void;
}

const QuestionEditor: React.FC<{ question: Question; index: number; onUpdate: (q: Question) => void; onDelete: (id: string) => void }> = ({ question, index, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question);

  const handleSave = () => {
    onUpdate(editedQuestion);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedQuestion(question);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedQuestion(prev => ({ ...prev, [name]: value }));
  };
  
  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...(editedQuestion.options || [])];
    newOptions[optionIndex] = value;
    setEditedQuestion(prev => ({...prev, options: newOptions}));
  };

  if (isEditing) {
    return (
      <div className="p-4 border border-indigo-200 bg-indigo-50 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-indigo-700">Editing Q{index + 1}</span>
            <div>
              <button onClick={handleCancel} className="px-3 py-1 text-sm bg-gray-200 rounded-md mr-2 hover:bg-gray-300">Cancel</button>
              <button onClick={handleSave} className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">Save</button>
            </div>
        </div>
        <textarea name="question_text" value={editedQuestion.question_text} onChange={handleInputChange} className="w-full p-2 border rounded" rows={3}/>
        {editedQuestion.type === 'MCQ' && editedQuestion.options?.map((opt, i) => (
            <div key={i} className="flex items-center my-1">
                <span className="mr-2 font-mono">{String.fromCharCode(65 + i)}</span>
                <input type="text" value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} className="w-full p-1 border rounded text-sm"/>
            </div>
        ))}
        <div className="mt-2">
            <label className="font-semibold text-sm">Correct Answer:</label>
            <input name="correct_answer" value={editedQuestion.correct_answer} onChange={handleInputChange} className="w-full p-1 border rounded mt-1"/>
        </div>
        <div className="mt-2">
            <label className="font-semibold text-sm">Solution:</label>
            <textarea name="solution" value={editedQuestion.solution} onChange={handleInputChange} className="w-full p-1 border rounded mt-1" rows={2}/>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg mb-4 hover:border-indigo-400 group transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold">{`Q${index + 1}. ${question.question_text}`}</p>
          {question.type === 'MCQ' && question.options && (
            <div className="grid grid-cols-2 gap-x-8 text-sm mt-2">
              {question.options.map((opt, i) => <span key={i}>{`${String.fromCharCode(65 + i)}) ${opt}`}</span>)}
            </div>
          )}
          <div className="mt-2 text-sm text-green-700 bg-green-50 inline-block px-2 py-1 rounded">
            <strong>Answer:</strong> {question.correct_answer}
          </div>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button title="Edit" onClick={() => setIsEditing(true)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full"><EditIcon /></button>
            <button title="Delete" onClick={() => onDelete(question.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full"><DeleteIcon /></button>
            <button title="Regenerate (not implemented)" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-full cursor-not-allowed"><RefreshIcon /></button>
        </div>
      </div>
    </div>
  );
};

export const Step6_Editor: React.FC<Props> = ({ onNext, onBack, paperData, updatePaperData }) => {
  if (!paperData.generatedPaper) {
    return <div>Loading paper...</div>;
  }
  
  const handleUpdateQuestion = (updatedQuestion: Question) => {
    const updatedPaper = { ...paperData.generatedPaper } as Paper;
    updatedPaper.questions = updatedPaper.questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q);
    updatePaperData({ generatedPaper: updatedPaper });
  };
  
  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
        const updatedPaper = { ...paperData.generatedPaper } as Paper;
        updatedPaper.questions = updatedPaper.questions.filter(q => q.id !== questionId);
        updatedPaper.answer_key = updatedPaper.answer_key.filter(a => a.id !== questionId);
        updatePaperData({ generatedPaper: updatedPaper });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-700">Review & Edit Paper</h2>
      <p className="mt-2 text-slate-500">Your question paper is ready. Review each question and make any necessary edits. Changes are saved automatically.</p>
      
      <div className="mt-8">
        {paperData.generatedPaper.questions.map((q, i) => (
          <QuestionEditor key={q.id} question={q} index={i} onUpdate={handleUpdateQuestion} onDelete={handleDeleteQuestion} />
        ))}
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
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150"
        >
          Next: Export
        </button>
      </div>
    </div>
  );
};
