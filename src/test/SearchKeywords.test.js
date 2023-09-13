import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import SearchKeywords from '../components/SearchKeywords';

const keywords = ['acute disease', 'acute myocardial infarction', 'arrhythmia, sinus', 'arrhythmias, cardiac']
const handleKeywordClick = () => void 0;

it('renders without crashing', () => {
  render(<SearchKeywords selectedKeywords={keywords} handleKeywordClick={handleKeywordClick}/>);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<SearchKeywords selectedKeywords={keywords} handleKeywordClick={handleKeywordClick}/>);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
