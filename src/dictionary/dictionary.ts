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
        main_parahrase: string[];
    };
    phonetic: string;
    voice:any;
    example_sentence: {
        sentence_raw: string;
        sentence_translation: string;
    }[]
}

export interface dictionary {
    translate:(req:translationRequest)=>Promise<translationResult|null>;
    option: dictionaryOption;
}

export interface dictionaryOption {
    maxexample: number;
}

export interface pronunciation {
    name: string;
    phonetic: string;
    voiceLink: string|null;
}