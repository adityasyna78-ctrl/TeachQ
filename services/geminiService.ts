
import { GoogleGenAI, Type } from "@google/genai";
import { PaperData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const SYSTEM_INSTRUCTION = `You are an expert exam-question generation engine for CBSE classes 9–12 in India. Your primary goal is to produce accurate, curriculum-aligned questions and answers based on the NCERT syllabus.
Key Instructions:
1.  **NEVER** copy NCERT textbook content verbatim for more than 25 continuous words. Paraphrase and create original questions that test the concepts.
2.  **ALWAYS** output a valid JSON object that strictly matches the provided schema. No extra text or explanations outside the JSON structure.
3.  **Prioritize correctness and clarity.** Questions should be unambiguous and appropriate for the specified class and difficulty level.
4.  **Tag each question** with an NCERT topic name from the provided list.
5.  The final output must be deterministic. Adhere to the API configuration provided.
6. Ensure the sum of marks for all generated questions equals the total marks specified in the prompt.
7. For MCQs, provide exactly 4 distinct options labeled A-D and specify the correct answer letter.
8. For all questions, provide a correct answer. For SHORT and LONG answer questions, also provide a concise solution.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    paper_meta: {
      type: Type.OBJECT,
      properties: {
        class: { type: Type.STRING },
        subject: { type: Type.STRING },
        topics: { type: Type.ARRAY, items: { type: Type.STRING } },
        total_questions: { type: Type.INTEGER },
        total_marks: { type: Type.INTEGER },
      },
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["MCQ", "SHORT", "LONG", "NUMERIC"] },
          marks: { type: Type.INTEGER },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          topic: { type: Type.STRING },
          question_text: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correct_answer: { type: Type.STRING },
          solution: { type: Type.STRING },
        },
      },
    },
    answer_key: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          answer: { type: Type.STRING },
          marks: { type: Type.INTEGER },
        },
      },
    },
  },
};

const createMockPaper = (paperData: PaperData) => {
    const { structure, class: className, subject, selectedTopics } = paperData;
    const totalMarks = (structure.mcqCount * structure.mcqMarks) + (structure.shortCount * structure.shortMarks) + (structure.longCount * structure.longMarks);
    
    let questions = [];
    let answer_key = [];
    let qCount = 0;

    for(let i = 0; i < structure.mcqCount; i++) {
        qCount++;
        const topic = selectedTopics[i % selectedTopics.length] || "General";
        questions.push({
            id: `Q${qCount}`, type: "MCQ", marks: structure.mcqMarks, difficulty: "Easy", topic,
            question_text: `This is a mock MCQ question ${qCount} on the topic of ${topic}. What is the correct option?`,
            options: ["Option A", "Option B", "Option C", "Option D"], correct_answer: "B", solution: "This is the explanation for why B is correct."
        });
        answer_key.push({ id: `Q${qCount}`, answer: "B", marks: structure.mcqMarks });
    }
    for(let i = 0; i < structure.shortCount; i++) {
        qCount++;
        const topic = selectedTopics[i % selectedTopics.length] || "General";
        questions.push({
            id: `Q${qCount}`, type: "SHORT", marks: structure.shortMarks, difficulty: "Medium", topic,
            question_text: `This is a mock SHORT answer question ${qCount} on ${topic}. Explain the concept.`,
            correct_answer: "This is the correct short answer.", solution: "This is a step-by-step solution."
        });
        answer_key.push({ id: `Q${qCount}`, answer: "This is the correct short answer.", marks: structure.shortMarks });
    }
    for(let i = 0; i < structure.longCount; i++) {
        qCount++;
        const topic = selectedTopics[i % selectedTopics.length] || "General";
        questions.push({
            id: `Q${qCount}`, type: "LONG", marks: structure.longMarks, difficulty: "Hard", topic,
            question_text: `This is a mock LONG answer question ${qCount} on ${topic}. Elaborate in detail.`,
            correct_answer: "This is the detailed correct answer for the long question.", solution: "Here is a full solution for the long question, explaining all the steps involved."
        });
        answer_key.push({ id: `Q${qCount}`, answer: "This is the detailed correct answer for the long question.", marks: structure.longMarks });
    }

    return {
        paper_meta: { class: className, subject, topics: selectedTopics, total_questions: structure.totalQuestions, total_marks: totalMarks },
        questions,
        answer_key
    };
};

export const generateQuestionPaper = async (paperData: PaperData) => {
  const { structure, class: className, subject, selectedTopics } = paperData;
  const totalMarks = (structure.mcqCount * structure.mcqMarks) + (structure.shortCount * structure.shortMarks) + (structure.longCount * structure.longMarks);

  if (!ai) {
    console.log("Using mock service to generate paper.");
    return new Promise(resolve => setTimeout(() => resolve(createMockPaper(paperData)), 2000));
  }
  
  const userPrompt = `
    Generate a question paper for Class ${className} ${subject}.
    Cover the following topics: ${JSON.stringify(selectedTopics)}.
    
    Requirements:
    - Total Questions: ${structure.totalQuestions}
    - Total Marks: ${totalMarks}
    - Question Distribution:
      - ${structure.mcqCount} MCQs of ${structure.mcqMarks} marks each.
      - ${structure.shortCount} Short Answer questions of ${structure.shortMarks} marks each.
      - ${structure.longCount} Long Answer questions of ${structure.longMarks} marks each.
    - Difficulty Distribution: Approximately 40% Easy, 40% Medium, 20% Hard.
    
    Return the output as a valid JSON object matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
        topP: 1,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating question paper with Gemini API:", error);
    throw new Error("Failed to generate question paper. The AI model returned an error or invalid data.");
  }
};
