

type lang = "zh"|"en"


export interface translation {
    title: string[];
    paraphrase: string[];
    source: string;
}

export interface translationRequest {
    queryWord: string;
    sourceLang: lang;
    targetLang: lang;
}

export interface translationResult {
    queryWord: string;
    paraphrase: {
        main_paraphrase: paraphrase;
        other_paraphrase?: paraphrase[]
    };
    pronounce:pronounce[]
    example_sentence: {
        sentence_raw: string;
        sentence_translation: string;
    }[]
}
export interface dictionary {  
    option: dictionaryOption;  
    displayName(): Promise<string>;  
    translate(req: translationRequest): Promise<translationResult|null>;  
}

export interface dictionaryOption {
    maxexample: number;
}

export interface paraphrase {
    source: string;
    paraphrase: string[];
}

export interface pronounce {
    name: string;
    phonetic: string;
    voiceLink: string|null;
}