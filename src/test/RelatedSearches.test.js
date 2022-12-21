import React from 'react';
import RelatedSearches from '../components/RelatedSearches';
import { mount } from 'enzyme';
import searchResult from '../../fixtures/searchResult';

const terms = ['hypertension', 'farm']
const keywords = ['mental health']
const setContentSearchStrings = () => void 0;
const setSelectedKeywords = () => void 0;
const handleConceptSelect = () => void 0;


it('renders without crashing', () => {
  mount(
    <RelatedSearches
      searchResults={searchResult}
      contentSearchStrings={terms}
      setContentSearchStrings={setContentSearchStrings}
      selectedKeywords={keywords}
      setSelectedKeywords={setSelectedKeywords}
      handleConceptSelect={handleConceptSelect}
    />
  );
});