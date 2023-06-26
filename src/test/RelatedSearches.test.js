import React from 'react';
import { render } from '@testing-library/react';
import RelatedSearches from '../components/RelatedSearches';
import searchResult from '../../fixtures/searchResult';

const terms = ['hypertension', 'farm']
const keywords = ['mental health']
const setContentSearchStrings = () => void 0;
const setSelectedKeywords = () => void 0;
const setSelectedConcepts = () => void 0;
const setSearchStatus = () => void 0;


it('renders without crashing', () => {
  render(
    <RelatedSearches
      searchResults={searchResult}
      contentSearchStrings={terms}
      setContentSearchStrings={setContentSearchStrings}
      selectedKeywords={keywords}
      setSelectedKeywords={setSelectedKeywords}
      setSelectedConcepts={setSelectedConcepts}
      setSearchStatus={setSearchStatus}
    />
  );
});