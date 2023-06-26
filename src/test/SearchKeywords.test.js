import React from 'react';
import { render } from '@testing-library/react';
import SearchKeywords from '../components/SearchKeywords';

const keywords = ['acute disease', 'acute myocardial infarction', 'arrhythmia, sinus', 'arrhythmias, cardiac']
const handleKeywordClick = () => void 0;

it('renders without crashing', () => {
  render(<SearchKeywords selectedKeywords={keywords} handleKeywordClick={handleKeywordClick}/>);
});