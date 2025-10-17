
import React, { useEffect } from 'react';
import { PaperData, Branding } from '../../types';
import { PaperPreview } from '../PaperPreview';

interface Props {
  onNext: () => void;
  onBack: () => void;
  updatePaperData: (updates: Partial<PaperData>) => void;
  paperData: PaperData;
}

const TextInput: React.FC<{label: string, id: keyof Branding, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }> = ({ label, id, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
        <input
            type="text"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);

export const Step4_Branding: React.FC<Props> = ({ onNext, onBack, updatePaperData, paperData }) => {
  const { branding, structure } = paperData;

  useEffect(() => {
    const totalMarks = (structure.mcqCount * structure.mcqMarks) + (structure.shortCount * structure.shortMarks) + (structure.longCount * structure.longMarks);
    if (branding.totalMarks !== totalMarks.toString()) {
      updatePaperData({ branding: { ...branding, totalMarks: totalMarks.toString() } });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structure, branding.totalMarks]);
  
  const handleBrandingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updatePaperData({ branding: { ...branding, [name]: value } });
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePaperData({ branding: { ...branding, logoUrl: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-700">Header & Branding</h2>
        <p className="mt-2 text-slate-500">Customize the look of your question paper. Changes will be reflected in the live preview.</p>
        
        <div className="mt-8 space-y-4">
            <TextInput label="School Name" id="schoolName" value={branding.schoolName} onChange={handleBrandingChange} />
            <TextInput label="Exam Name" id="examName" value={branding.examName} onChange={handleBrandingChange} />
            
            <div>
              <label className="block text-sm font-medium text-slate-700">School Logo</label>
              <input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Date" id="date" value={branding.date} onChange={handleBrandingChange} placeholder="e.g. 2024-09-15" />
              <TextInput label="Duration" id="duration" value={branding.duration} onChange={handleBrandingChange} placeholder="e.g. 3 Hours"/>
            </div>
            
            <TextInput label="Footer Note" id="footerNote" value={branding.footerNote} onChange={handleBrandingChange} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-600 mb-2">Live Preview</h3>
        <div className="scale-75 origin-top-left lg:scale-100">
           <PaperPreview paperData={paperData} mode="question" />
        </div>
      </div>

      <div className="lg:col-span-2 mt-4 flex justify-between">
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
          Generate Paper
        </button>
      </div>
    </div>
  );
};
