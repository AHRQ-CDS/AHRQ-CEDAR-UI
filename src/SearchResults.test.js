import React from 'react';
import SearchResults from './SearchResults';
import { mount } from 'enzyme';
import searchResult from '../fixtures/searchResult';

it('renders without crashing', () => {
  mount(<SearchResults searchResults={searchResult} page={1} />);
});