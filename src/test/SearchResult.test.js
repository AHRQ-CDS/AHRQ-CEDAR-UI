import React from 'react';
import { render } from '@testing-library/react';
import SearchResult from '../components/SearchResult';
import searchResult from '../../fixtures/searchResult';

it('renders without crashing', () => {
  render(<SearchResult resource={searchResult} />);
});