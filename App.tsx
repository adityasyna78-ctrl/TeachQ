
import React, { useState, useCallback } from 'react';
import { Stepper } from './components/Stepper';
import { Step1_ClassSubject } from './components/steps/Step1_ClassSubject';
import { Step2_TopicSelection } from './components/steps/Step2_TopicSelection';
import { Step3_PaperStructure } from './components/steps/Step3_PaperStructure';
import { Step4_Branding } from './components/steps/Step4_Branding';
import { Step5_Generating } from './components/steps/Step5_Generating';
import { Step6_Editor } from './components/steps/Step6_Editor';
import { Step7_Export } from './components/steps/Step7_Export';
import { usePaperBuilder } from './hooks/usePaperBuilder';
import { Paper } from './types';
import { HeaderIcon } from './components/icons';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { paperData, updatePaperData, resetPaperData } = usePaperBuilder();

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 7));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const onGenerationComplete = useCallback((generatedPaper: Paper) => {
    updatePaperData({ generatedPaper });
    handleNext();
  }, [updatePaperData]);

  const startNewPaper = () => {
    resetPaperData();
    setCurrentStep(1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1_ClassSubject onNext={handleNext} updatePaperData={updatePaperData} paperData={paperData} />;
      case 2:
        return <Step2_TopicSelection onNext={handleNext} onBack={handleBack} updatePaperData={updatePaperData} paperData={paperData} />;
      case 3:
        return <Step3_PaperStructure onNext={handleNext} onBack={handleBack} updatePaperData={updatePaperData} paperData={paperData} />;
      case 4:
        return <Step4_Branding onNext={handleNext} onBack={handleBack} updatePaperData={updatePaperData} paperData={paperData} />;
      case 5:
        return <Step5_Generating onBack={handleBack} onGenerationComplete={onGenerationComplete} paperData={paperData} />;
      case 6:
        return <Step6_Editor onNext={handleNext} onBack={handleBack} paperData={paperData} updatePaperData={updatePaperData} startNewPaper={startNewPaper} />;
      case 7:
        return <Step7_Export onBack={handleBack} paperData={paperData} startNewPaper={startNewPaper} />;
      default:
        return <Step1_ClassSubject onNext={handleNext} updatePaperData={updatePaperData} paperData={paperData} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <HeaderIcon />
            <h1 className="text-2xl font-bold text-slate-700 tracking-tight" style={{ fontFamily: "'Roboto', sans-serif" }}>
              CBSE Question Paper Generator
            </h1>
          </div>
          {currentStep > 5 && (
            <button
              onClick={startNewPaper}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150"
            >
              Create New Paper
            </button>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Stepper currentStep={currentStep} goToStep={goToStep} />
        <div className="mt-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          {renderStep()}
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} AI Question Paper Generator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
