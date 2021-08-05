import React from 'react';
import SearchResult from './SearchResult';
import { mount } from 'enzyme';
import searchResult from '../fixtures/searchResult';

it('renders without crashing', () => {
  mount(<SearchResult resource={searchResult} />);
});