import subtitle from './subtitle';
import ReactDOM from 'react-dom';
import SubtiltePicker from './components/advancedSubtitle/SubtitlePicker';
import DraggableContainer from './components/DraggableContainer';


class youtubeLangLeaner {  
  subtitle: subtitle  

  constructor() {  
    this.subtitle = new subtitle()  
    this.replaceOriginSubtitle()  
  }  

  replaceOriginSubtitle = () => {  
    const container = document.createElement("div")  
    container.id = "langLearnerSubtitle"  
    document.body.appendChild(container)  

    ReactDOM.render(  
      <DraggableContainer>  
        <SubtiltePicker subtitle={this.subtitle}/>  
      </DraggableContainer>,   
      container,   
      () => {  
        console.log("advanced subtitle has been loaded")  
      }  
    )  
  }  
} 


new youtubeLangLeaner()