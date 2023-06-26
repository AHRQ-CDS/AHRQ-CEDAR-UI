import React from 'react';
import { render } from '@testing-library/react';
import SearchResultTags from '../components/SearchResultTags';
import { concepts } from '../../fixtures/concepts';

const keywords = ['acute disease', 'acute myocardial infarction', 'arrhythmia, sinus', 'arrhythmias, cardiac']
const onKeywordClick = () => void 0;

it('renders without crashing', () => {
  render(<SearchResultTags keywords={keywords} concepts={concepts} onKeywordClick={onKeywordClick}/>);
});