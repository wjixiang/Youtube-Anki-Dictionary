import React, { useEffect, useState } from "react";  
import { translationRequest, translationResult } from '../dictionary';  
import youdao_en_t_zh from "@/dictionary/en_to_zh[web]/youdao_en_t_zh";  
import { CircularProgress } from "@mui/material";  
import AudioPlayer from "./AudioPlayer";  
import { AddToAnki } from "./AddToAnki";  
import styled from "styled-components";  

const voidTransResult: translationResult = {  
    queryWord: "",  
    paraphrase: {  
        main_paraphrase: {  
            source: "",  
            paraphrase: []  
        },  
        other_paraphrase: undefined  
    },  
    pronounce: [],  
    example_sentence: []  
}  

const LoadingContainer = styled.div`  
    display: flex;  
    justify-content: center;  
    align-items: center;  
    min-height: 200px;  
`;  

const TransitionContainer = styled.div`  
    transition: all 0.3s ease-in-out;  
    background: white;  
    border-radius: 12px;  
    padding: 20px;  
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  
    margin: 10px;  
    max-width: 800px;  
`;  

const Header = styled.div`  
    display: flex;  
    align-items: center;  
    justify-content: space-between;  
    margin-bottom: 20px;  
    padding-bottom: 15px;  
    border-bottom: 2px solid #f0f0f0;  
`;  

const Title = styled.h1`  
    font-size: 2.5rem;  
    font-weight: 600;  
    color: #2f855a;  
    margin: 0;  
    transition: all 0.3s;  
    
    &:hover {  
        color: #38a169;  
    }  
`;  

const PronounceContainer = styled.div`  
    display: flex;  
    flex-wrap: wrap;  
    gap: 20px;  
    margin: 15px 0;  
    padding: 10px;  
    background: #f8f9fa;  
    border-radius: 8px;  
`;  

const PronounceItem = styled.div`  
    display: flex;  
    align-items: center;  
    gap: 10px;  
    padding: 8px 12px;  
    background: white;  
    border-radius: 6px;  
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);  
`;  

const PhoneticText = styled.div`  
    font-family: 'Arial', sans-serif;  
    color: #666;  
    font-size: 0.9rem;  
`;  

const ParaphraseList = styled.ul`  
    list-style-type: none;  
    padding: 0;  
    margin: 15px 0;  
`;  

const ParaphraseItem = styled.li`  
    padding: 10px 15px;  
    margin: 8px 0;  
    border-left: 3px solid #4ade80;  
    background: #f8f9fa;  
    border-radius: 0 8px 8px 0;  
    transition: all 0.2s;  
    
    &:hover {  
        background: #f0f9f0;  
        transform: translateX(5px);  
    }  
`;  

const AnkiContainer = styled.div`  
    padding: 10px;  
    background: #f8f9fa;  
    border-radius: 8px;  
    margin-left: 15px;  
`;  

const DictContainer: React.FC<{  
    dictionary: youdao_en_t_zh,  
    query: translationRequest,  
    sentence?: string  
}> = (props) => {  
    const [isLoading, setIsLoading] = useState(true);  
    const [transResult, setTransResult] = useState<translationResult>(voidTransResult);  

    useEffect(() => {  
        const translate = async () => {  
            try {  
                setIsLoading(true);  
                const result = await props.dictionary.translate(props.query);  
                setTransResult(result ?? voidTransResult);  
            } catch (err) {  
                console.error(err);  
            } finally {  
                setIsLoading(false);  
            }  
        };  

        translate();  
    }, [props.query]);  

    if (isLoading) {  
        return (  
            <LoadingContainer data-testid="loading">  
                <CircularProgress />  
            </LoadingContainer>  
        );  
    }  

    return (  
        <TransitionContainer>  
            <Header>  
                <Title data-testid="query-word">{transResult.queryWord}</Title>  
                <AnkiContainer>  
                    <AddToAnki  
                        Text={props.query.queryWord}  
                        Phonetic={transResult.pronounce[0]?.phonetic}  
                        Context={props.sentence}  
                        Paraphrase={transResult.paraphrase.main_paraphrase.paraphrase.join("<br/>")}  
                        Translation={""}  
                        Pronounce={{  
                            AmE: transResult.pronounce[0]?.voiceLink,  
                            BrE: transResult.pronounce[1]?.voiceLink  
                        }}  
                        url={""}  
                    />  
                </AnkiContainer>  
            </Header>  

            <PronounceContainer>  
                {transResult.pronounce.map(audio => (  
                    <PronounceItem key={audio.phonetic}>  
                        <div>{audio.name}</div>  
                        <PhoneticText>{audio.phonetic}</PhoneticText>  
                        <AudioPlayer src={audio.voiceLink} />  
                    </PronounceItem>  
                ))}  
            </PronounceContainer>  

            <ParaphraseList>  
                {transResult.paraphrase.main_paraphrase.paraphrase.map((e, index) => (  
                    <ParaphraseItem key={index}>{e}</ParaphraseItem>  
                ))}  
            </ParaphraseList>  
        </TransitionContainer>  
    );  
};  

export default DictContainer;