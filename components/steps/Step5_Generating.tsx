
import React, { useState, useEffect } from 'react';
import { Paper, PaperData } from '../../types';
import { generateQuestionPaper } from '../../services/geminiService';

interface Props {
  onBack: () => void;
  onGenerationComplete: (paper: Paper) => void;
  paperData: PaperData;
}

const loadingMessages = [
    "Consulting NCERT textbooks...",
    "Crafting challenging questions...",
    "Aligning with CBSE curriculum...",
    "Checking for clarity and accuracy...",
    "Building the question paper structure...",
    "Finalizing the answer key..."
];

export const Step5_Generating: React.FC<Props> = ({ onBack, onGenerationComplete, paperData }) => {
    const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage(prev => {
                const currentIndex = loadingMessages.indexOf(prev);
                return loadingMessages[(currentIndex + 1) % loadingMessages.length];
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleGenerate = async () => {
        setError(null);
        try {
            const result = await generateQuestionPaper(paperData);
            onGenerationComplete(result as Paper);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        }
    };

    useEffect(() => {
        handleGenerate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
            {!error ? (
                <>
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
                    <h2 className="mt-6 text-2xl font-bold text-slate-700">Generating Your Paper</h2>
                    <p className="mt-2 text-slate-500 text-center">{currentMessage}</p>
                    <p className="mt-2 text-sm text-slate-400">This may take a moment. Please don't close this window.</p>
                </>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">Generation Failed</h2>
                    <p className="mt-2 text-slate-600 bg-red-50 p-4 rounded-md">{error}</p>
                    <div className="mt-6 flex justify-center gap-4">
                        <button
                            onClick={onBack}
                            className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300"
                        >
                            Back to Branding
                        </button>
                        <button
                            onClick={handleGenerate}
                            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
                        >
                            Retry Generation
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
