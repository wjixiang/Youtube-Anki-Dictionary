import React from 'react';  
import { render, fireEvent } from '@testing-library/react';  
import { SearchPanel } from '../components/searchPanel'; 

describe(SearchPanel,()=>{
  const {getByTestId} = render(<SearchPanel/>)

  it("has searching component",()=>{
    // console.log(getByTestId("search-input"))
    expect(getByTestId("search-input")).toBeDefined()
  })

})