export interface ListeningData {
    id: string;
    topic: string;
    finished: boolean;
    sentences: ListeningSentence[];
}

export interface ListeningSentence {
    id: string;
    words: ListeningWord[];
    sentence: string;
    audio: string;
    answered: boolean;
}

export interface ListeningWord {
    word: string;
    user_word: string;
    is_word: boolean;
    askable: boolean;
    wrong: boolean;
}

export interface ListeningResult {
    id: string;
    score: number;
}