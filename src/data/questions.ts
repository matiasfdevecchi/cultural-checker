export type Question = {
    id: string;
    text: string;
    tags?: string[];
    minTime: number;
    maxTime: number;
}

export const questions: Question[] = [
    {
        id: 'interest-in-position',
        text: 'Why are you interested in this position?',
        tags: ['company', 'role'],
        minTime: 30,
        maxTime: 60,
    },
    {
        id: 'about-yourself',
        text: 'Tell me about yourself',
        minTime: 30,
        maxTime: 60,
    }
]