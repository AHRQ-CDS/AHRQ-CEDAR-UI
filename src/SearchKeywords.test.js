import React from 'react';
import SearchKeywords from './SearchKeywords';
import { mount } from 'enzyme';

const keywords = ['acute disease', 'acute myocardial infarction', 'arrhythmia, sinus', 'arrhythmias, cardiac']
const handleKeywordClick = () => void 0;

it('renders without crashing', () => {
  mount(<SearchKeywords selectedKeywords={keywords} handleKeywordClick={handleKeywordClick}/>);
});