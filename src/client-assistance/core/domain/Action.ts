import { Question } from "@/data/questions";

export type AssistanceResponse = {
    redFlags: string[];
    greenFlags: string[];
    result: 'strong no' | 'no' | 'yes' | 'strong yes';
    questionId: Question['id'];
    question: string;
    response: string;
}