let popupElement = null;  
let mouseX = 0, mouseY = 0;  

// 实时追踪鼠标位置  
document.addEventListener('mousemove', (event) => {  
  mouseX = event.clientX;  
  mouseY = event.clientY;  
});  

document.addEventListener('keydown', (event) => {  
  if (event.key === 'Shift') {   
    console.log("Shift key detected!");  
    
    try {  
      // 获取YouTube字幕元素  
      const subtitleElement = getYouTubeSubtitleElement();  
      
      if (subtitleElement) {  
        // 获取当前单词  
        const word = getWordAtPosition(subtitleElement, mouseX, mouseY);  
        
        // 创建弹窗并显示单词  
        createPopup(event, word);  
      }  
    } catch (error) {  
      console.error("Error creating popup:", error);  
    }  
  }  
});  

document.addEventListener('keyup', (event) => {  
  if (event.key === 'Shift' && popupElement) {  
    console.log("Removing popup on Shift key up");  
    removePopup();  
  }  
});  

function createPopup(event, word = '') {  
  // 移除之前的弹窗（如果存在）  
  if (popupElement) {  
    removePopup();  
  }  

  // 创建弹窗元素  
  popupElement = document.createElement('div');  
  
  // 详细的样式设置  
  Object.assign(popupElement.style, {  
    position: 'fixed',  
    zIndex: '9999',  
    background: 'white',  
    border: '1px solid black',  
    padding: '10px',  
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',  
    left: `${mouseX}px`,  
    top: `${mouseY}px`,  
    width: '250px',  
    minHeight: '100px',  
    color: 'black'  
  });  

  // 添加唯一标识  
  popupElement.id = 'shift-popup';  
  popupElement.setAttribute('data-type', 'chrome-extension-popup');  

  // 弹窗内容  
  popupElement.innerHTML = `  
    <div>  
      <h3>单词信息</h3>  
      <p>选中的单词: <strong>${word || '未选中'}</strong></p>  
      <div class="actions">  
        <button id="action1" style="margin: 5px;">翻译</button>  
        <button id="action2" style="margin: 5px;">搜索</button>  
      </div>  
    </div>  
  `;  

  // 添加事件监听  
  const action1 = popupElement.querySelector('#action1');  
  const action2 = popupElement.querySelector('#action2');  

  if (action1) {  
    action1.addEventListener('click', () => {  
      console.log('翻译被点击', word);  
      // 在这里添加翻译逻辑  
      translateWord(word);  
    });  
  }  

  if (action2) {  
    action2.addEventListener('click', () => {  
      console.log('搜索被点击', word);  
      // 在这里添加搜索逻辑  
      searchWord(word);  
    });  
  }  

  // 将弹窗添加到文档  
  document.body.appendChild(popupElement);  

  console.log("Popup created and added to document");  
}  

function removePopup() {  
  if (popupElement) {  
    console.log("Attempting to remove popup");  
    try {  
      document.body.removeChild(popupElement);  
      popupElement = null;  
      console.log("Popup removed successfully");  
    } catch (error) {  
      console.error("Error removing popup:", error);  
    }  
  }  
}  

// 点击外部关闭弹窗  
document.addEventListener('click', (event) => {  
  if (popupElement && event.target && !popupElement.contains(event.target)) {  
    console.log("Clicking outside popup");  
    removePopup();  
  }  
});  

// 单词翻译函数示例  
function translateWord(word) {  
  if (!word) {  
    alert('请先选择一个单词');  
    return;  
  }  

  // 这里可以集成翻译API  
  // 示例使用 Google Translate  
  const translateUrl = `https://translate.google.com/?sl=auto&tl=zh-CN&text=${encodeURIComponent(word)}&op=translate`;  
  window.open(translateUrl, '_blank');  
}  

// 单词搜索函数示例  
function searchWord(word) {  
  if (!word) {  
    alert('请先选择一个单词');  
    return;  
  }  

  // 使用 Google 搜索  
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(word)}`;  
  window.open(searchUrl, '_blank');  
}  

// 以下是之前的 getWordAtPosition 和 getYouTubeSubtitleElement 函数保持不变

function getWordAtPosition(element: Element, x: number, y: number): string | null {  
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
  
  
  // YouTube 字幕选择器  
  function getYouTubeSubtitleElement() {  
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
