import React from 'react';
import { render } from '@testing-library/react';
import SearchResults from '../components/SearchResults';
import searchResult from '../../fixtures/searchResult';

it('renders without crashing', () => {
  render(<SearchResults searchResults={searchResult} page={1} />);
});