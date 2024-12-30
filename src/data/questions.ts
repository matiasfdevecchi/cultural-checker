export type Question = {
    id: string;
    text: string;
    tags?: string[];
}

export const questions: Question[] = [
    {
        id: 'interest-in-position',
        text: 'Why are you interested in this position?',
        tags: ['company', 'role'],
    },
    {
        id: 'about-yourself',
        text: 'Tell me about yourself',
    }
]