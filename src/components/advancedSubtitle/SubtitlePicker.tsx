import { useEffect, useMemo, useRef, useState } from 'react';  
import styled, { css } from 'styled-components';  
import subtitle from '../../subtitle';  
import  SubtitleDisplayBox  from './SubtitleDisplayBox';  
import WordPopup from '../WordPopup';  

export interface subtitlePickerProps {  
    subtitle: subtitle;  
}  

const StyledContainer = styled.div`  
    position: relative;  
    display: flex;  
    flex-direction: column;  
`;  

// 新增一个包装容器来处理动画面板  
const SearchPanelWrapper = styled.div`  
    position: relative;  
    width: 100%;  
`;  

const AnimatedSearchPanel = styled.div<{ $visible: boolean }>`  
    position: absolute;  
    bottom: 0;  // 固定在底部  
    left: 0;  
    right: 0;  
    z-index: 10;  
    
    // 使用transform来实现向上展开的效果  
    transform: scaleY(0);  
    transform-origin: bottom;  
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);  
    
    // 内容容器  
    > div {  
        height: 400px; // 固定高度  
        overflow-y: auto;  
    }  

    ${({ $visible }) => $visible && css`  
        transform: scaleY(1);  
    `}  
`;  

// 子标题显示框容器  
const SubtitleBoxContainer = styled.div`  
    position: relative;  
    width: 100%;  
`;  

const SubtiltePicker: React.FC<subtitlePickerProps> = (props) => {  
    const [subtitleData, setSubtitleData] = useState(props.subtitle.record);  
    const [selectedWord, setSelectedWord] = useState("apple");  
    const [selectedSentence, setSelectedSentence] = useState("");  
    const [isWordPanelVisible, setIsWordPanelVisible] = useState(false);  
    const popupRef = useRef<HTMLDivElement>(null);  

    useEffect(() => {  
        // start to monitor subtitle   
        props.subtitle.startSubtitleEmit(setSubtitleData);  

        return () => {  
            // props.subtitle.stopSubtitleEmit();   
        };  
    }, []);   

    // useEffect(() => {  
    //     console.log('Subtitle data updated:', subtitleData);  
    // }, [subtitleData]);  

    useEffect(() => {  
        const handleClickOutside = (event: MouseEvent) => {  
            console.log("click:", event.target);  
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {  
                setIsWordPanelVisible(false);  
                console.log("close panel");  
            }  
        };  
        // 添加事件监听器  
        document.addEventListener('mousedown', handleClickOutside);  

        return () => {  
            document.removeEventListener('mousedown', handleClickOutside);  
        };  
    }, []);  

    const searchPanel = useMemo(() => {  
        return (  
            <SearchPanelWrapper>  
                <AnimatedSearchPanel   
                    ref={popupRef}  
                    $visible={isWordPanelVisible}  
                >  
                    <div>  
                        <WordPopup  
                            word={selectedWord}  
                            sentence={selectedSentence}  
                        />  
                    </div>  
                </AnimatedSearchPanel>  
            </SearchPanelWrapper>  
        );  
    }, [selectedWord, selectedSentence, isWordPanelVisible]);  

    return (  
        <StyledContainer>  
            {searchPanel}  
            
            <SubtitleBoxContainer>  
                <SubtitleDisplayBox  
                    subtitleDataList={subtitleData}  
                    setQueryWord={setSelectedWord}  
                    setSearchPanelVisible={setIsWordPanelVisible}  
                    setQuerySentence={setSelectedSentence}  
                />  
            </SubtitleBoxContainer>  
        </StyledContainer>  
    );  
};  

export default SubtiltePicker;