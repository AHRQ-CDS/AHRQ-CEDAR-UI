import React from 'react';
import { render } from '@testing-library/react';
import SearchResultHistory from '../components/SearchResultHistory';
import searchResult from '../../fixtures/searchResult';

const leftResource = searchResult;
const rightResource = searchResult;

it('renders without crashing', () => {
  render(<SearchResultHistory leftResource={leftResource} rightResource={rightResource} />);
});