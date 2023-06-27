import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import SearchResultTags from '../components/SearchResultTags';
import { concepts } from '../../fixtures/concepts';

const keywords = ['acute disease', 'acute myocardial infarction', 'arrhythmia, sinus', 'arrhythmias, cardiac']
const onKeywordClick = () => void 0;

it('renders without crashing', () => {
  render(<SearchResultTags keywords={keywords} concepts={concepts} onKeywordClick={onKeywordClick}/>);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<SearchResultTags keywords={keywords} concepts={concepts} onKeywordClick={onKeywordClick}/>);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
