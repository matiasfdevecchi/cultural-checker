import { Question } from "@/data/questions";

export type AssistanceResponse = {
    redFlags: string[];
    greenFlags: string[];
    result: 'Strong no' | 'No' | 'Yes' | 'Strong yes';
    questionId: Question['id'];
    question: string;
    response: string;
}