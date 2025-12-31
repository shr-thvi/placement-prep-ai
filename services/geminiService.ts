
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { QuizQuestion, LearningPath, InterviewFeedback } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuiz = async (role: string): Promise<QuizQuestion[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a 5-question multiple choice diagnostic quiz for someone aspiring to be a ${role}. Focus on technical and soft skills.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER, description: 'Index of the correct option (0-3)' },
          },
          required: ['question', 'options', 'correctAnswer'],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse quiz JSON", error);
    return [];
  }
};

export const generateLearningPath = async (role: string, quizScore: number): Promise<LearningPath> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a personalized learning path for a ${role} with a current diagnostic score of ${quizScore}/5. Include modules, projects, and career advice.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          careerAdvice: { type: Type.STRING },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                duration: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['lesson', 'project', 'quiz'] },
              },
              required: ['title', 'description', 'duration', 'type'],
            },
          },
        },
        required: ['role', 'modules', 'careerAdvice'],
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse learning path JSON", error);
    throw error;
  }
};

export const startInterviewChat = (role: string): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are an experienced hiring manager for a ${role} position. Conduct a professional but encouraging mock interview. Ask one question at a time. Total 4 questions. Start by introducing yourself and asking the first question. After 4 questions, tell the user the interview is over and summarize your thoughts briefly, then stop.`,
    },
  });
};

export const getInterviewFeedback = async (history: any[]): Promise<InterviewFeedback> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the following interview transcript and provide constructive feedback: ${JSON.stringify(history)}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: 'Overall score from 1 to 100' },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          advice: { type: Type.STRING },
        },
        required: ['score', 'strengths', 'weaknesses', 'advice'],
      },
    },
  });

  return JSON.parse(response.text);
};

export const getMentorMatches = async (role: string): Promise<any[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 3 realistic professional mentors for a ${role} role. Provide their name, role, company, and 3 specialties.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            company: { type: Type.STRING },
            specialties: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    },
  });
  return JSON.parse(response.text);
};
