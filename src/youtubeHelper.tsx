import React from 'react';  
import { createRoot } from 'react-dom/client';  
import DictContainer from "./components/YoudaoEZContainer";  
import youdao_en_t_zh from "./dictionary/en_to_zh[web]/youdao_en_t_zh";  


interface PopupProps {  
  word: string; 
  sentence: string; 
  onTranslate?: () => void;  
  onSearch?: () => void;  
}  

function WordPopup({ word, sentence, onTranslate, onSearch }: PopupProps) {  
  return (  
    <div style={{  
      background: 'white',  
      border: '1px solid black',  
      padding: '10px',  
    }}>  
      <div>  
        <h3>select: <strong>{word || '未选中'}</strong></h3>  
        <h3>subtitle: <strong>{sentence || '未选中'}</strong></h3>  
        <div className="actions">  
          <button   
            onClick={onTranslate}   
            style={{ margin: '5px' }}  
          >  
            翻译  
          </button>  
          <button   
            onClick={onSearch}   
            style={{ margin: '5px' }}  
          >  
            搜索  
          </button>  
        </div>  
        
        {word && (  
          <DictContainer  
            dictionary={new youdao_en_t_zh({  
              maxexample: 2  
            })}  
            query={{  
              queryWord: word,  
              sourceLang: "en",  
              targetLang: "zh"  
            }} 
            sentence={sentence}
          />  
        )}  
      </div>  
    </div>  
  );  
}  

class WordPopupManager {  
  private popupElement: HTMLDivElement | null = null;  
  private root: ReturnType<typeof createRoot> | null = null;  
  private mouseX: number = 0;  
  private mouseY: number = 0;  

  constructor() {  
    this.initMouseTracking();  
    this.initKeyboardHandlers();  
    this.startSubtitleEmit();
  }  

  private initMouseTracking() {  
    document.addEventListener('mousemove', (event) => {  
      this.mouseX = event.clientX;  
      this.mouseY = event.clientY;  
    });  
  }  

  private initKeyboardHandlers() {  
    document.addEventListener('keydown', this.handleKeyDown.bind(this));  
    // document.addEventListener('keyup', this.handleKeyUp.bind(this));  
    document.addEventListener('click', this.handleOutsideClick.bind(this));  
  }  

  private handleKeyDown(event: KeyboardEvent) {  
    if (event.key === 'Shift') {  
      try {  
        const subtitleElement = this.getYouTubeSubtitleElement();  
        
        if (subtitleElement) {  
          const sentence = subtitleElement.textContent
          const word = this.getWordAtPosition(subtitleElement, this.mouseX, this.mouseY);  
          this.createPopup(word,sentence);  
        }  
      } catch (error) {  
        console.error("Error creating popup:", error);  
      }  
    }  
  }  

  private handleKeyUp(event: KeyboardEvent) {  
    if (event.key === 'Shift') {  
      this.removePopup();  
    }  
  }  

  private handleOutsideClick(event: MouseEvent) {  
    // 检查是否存在弹窗元素  
    if (!this.popupElement) return;  
  
    // 检查点击事件的目标是否是一个节点  
    if (!(event.target instanceof Node)) return;  
  
    // 获取弹窗元素的边界矩形  
    const popupRect = this.popupElement.getBoundingClientRect();  
    console.log(event.clientX,event.clientY,popupRect)
    // 检查点击位置是否在弹窗范围内  
    const isClickInsidePopup =   
      event.clientX >= popupRect.left &&   
      event.clientX <= popupRect.right &&   
      event.clientY >= popupRect.top &&   
      event.clientY <= popupRect.bottom;  
  
    // 检查点击是否在弹窗元素内或其子元素内  
    // const isContainedInPopup = this.popupElement.contains(event.target);  
  
    // 如果点击不在弹窗内，则关闭弹窗  
    if (!isClickInsidePopup) {  
      this.removePopup();  
    }  
  }

  private createPopup(word: string | null,sentence: string) {  
    // 移除之前的弹窗  
    this.removePopup();  

    // 创建新的弹窗元素  
    this.popupElement = document.createElement('div');  
    this.popupElement.id = 'shift-popup';  
    this.popupElement.setAttribute('data-type', 'chrome-extension-popup');  

    // 设置位置  
    Object.assign(this.popupElement.style, {  
      position: 'fixed',  
      left: `${this.mouseX}px`,  
      top: `${this.mouseY}px`  
    });  

    // 将元素添加到文档  
    document.body.appendChild(this.popupElement);  

    // 创建 React 根  
    this.root = createRoot(this.popupElement);  

    // 渲染 React 组件  
    this.root.render(  
      <React.StrictMode>  
        <WordPopup   
          word={word || ''} 
          sentence={sentence}  
          onTranslate={() => this.translateWord(word)}  
          onSearch={() => this.searchWord(word)}  
        />  
      </React.StrictMode>  
    );  
  }  

  private removePopup() {  
    if (this.popupElement) {  
      try {  
        // 卸载 React 根  
        this.root?.unmount();  
        
        // 移除 DOM 元素  
        document.body.removeChild(this.popupElement);  
        this.popupElement = null;  
        this.root = null;  
      } catch (error) {  
        console.error("Error removing popup:", error);  
      }  
    }  
  }  

  private translateWord(word: string | null) {  
    if (!word) {  
      alert('请先选择一个单词');  
      return;  
    }  

    const translateUrl = `https://translate.google.com/?sl=auto&tl=zh-CN&text=${encodeURIComponent(word)}&op=translate`;  
    window.open(translateUrl, '_blank');  
  }  

  private searchWord(word: string | null) {  
    if (!word) {  
      alert('请先选择一个单词');  
      return;  
    }  

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(word)}`;  
    window.open(searchUrl, '_blank');  
  }  

  // 复用之前的方法  
  private getWordAtPosition(element: Element, x: number, y: number): string | null {  
    // 获取鼠标所在点的元素  
    const elementAtPoint = document.elementFromPoint(x, y);  
    
    if (!elementAtPoint || !element.contains(elementAtPoint)) {  
      return null;  
    }  
  
    // 创建 Range 对象  
    const range = document.caretRangeFromPoint(x, y);  
    
    if (!range) return null;  
  
    // 确保起始容器是文本节点  
    const startContainer = range.startContainer;  
    const startOffset = range.startOffset;  
  
    // 创建用于选择单词的 Range  
    const wordRange = document.createRange();  
    wordRange.setStart(startContainer, startOffset);  
    wordRange.setEnd(startContainer, startOffset);  
  
    // 类型安全的长度检查  
    const getNodeLength = (node: Node): number => {  
      return node.nodeType === Node.TEXT_NODE   
        ? (node as Text).length   
        : (node.textContent || '').length;  
    };  
  
    // 向前扩展  
    while (wordRange.startOffset > 0) {  
      wordRange.setStart(wordRange.startContainer, wordRange.startOffset - 1);  
      const word = wordRange.toString();  
      if (!/\w/.test(word)) {  
        wordRange.setStart(wordRange.startContainer, wordRange.startOffset + 1);  
        break;  
      }  
    }  
  
    // 向后扩展  
    while (wordRange.endOffset < getNodeLength(wordRange.endContainer)) {  
      wordRange.setEnd(wordRange.endContainer, wordRange.endOffset + 1);  
      const word = wordRange.toString();  
      if (!/\w/.test(word)) {  
        wordRange.setEnd(wordRange.endContainer, wordRange.endOffset - 1);  
        break;  
      }  
    }  
  
    return wordRange.toString().trim();  
  }  

  private getYouTubeSubtitleElement() {  
    // 根据不同的 YouTube 版本选择字幕元素  
    const subtitleSelectors = [  
      '.ytp-caption-segment',  
      '.caption-segment',  
      '.ytd-transcript-segment-renderer'  
    ];  
  
    for (const selector of subtitleSelectors) {  
      const element = document.querySelector(selector);  
      if (element) return element;  
    }  
  
    return null;  
  } 

  private async startSubtitleEmit() {
    console.log("start emiting subtitle")
    // 创建观察器实例  
    const observer = new MutationObserver((mutations) => {  
      mutations.forEach((mutation) => {  
        if (mutation.type === 'characterData' || mutation.type === 'childList') {  
          console.log('文本发生变化:', mutation.target.textContent);  
        }  
      });  
    }); 

    // 配置观察选项  
    const config = {  
      characterData: true, // 监听文本变化  
      childList: true,     // 监听子节点变化  
      subtree: true,       // 监听所有后代节点  
      characterDataOldValue: true // 记录文本变化前的值  
    };

    // 选择要观察的目标节点  
    const targetNode = this.getYouTubeSubtitleElement()

    // 开始观察  
    observer.observe(targetNode, config);  

    // 停止观察  
    // observer.disconnect(); 
    }
}  


new WordPopupManager();

   
