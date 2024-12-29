import React from 'react';  
import { render, fireEvent } from '@testing-library/react';  
import { SearchPanel } from '../components/searchPanel'; 
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe(SearchPanel,()=>{
  let inputBox: Element
  const temperaryDictOption = {
    maxexample: 2
  }
  

  beforeEach(() => {  
    const { getByPlaceholderText } = render(<SearchPanel dictOption={temperaryDictOption}/>);  
    inputBox = getByPlaceholderText("搜索...");  
  });  

  it("search the input word after 'Enter' is pressed",async()=>{
    
    await userEvent.type(inputBox, 'retina'); 
    // await new Promise(resolve => setTimeout(resolve,0));
    console.log(inputBox.getAttribute("value")) 
    expect(inputBox).toHaveValue('retina');  
    userEvent.keyboard("Enter")

  })

})