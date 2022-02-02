import React from 'react';
import SearchResultHistory from './SearchResultHistory';
import { mount } from 'enzyme';
import searchResult from '../fixtures/searchResult';

const leftResource = { status: "complete", data: searchResult}
const rightResource = { status: "complete", data: searchResult}

it('renders without crashing', () => {
  mount(<SearchResultHistory leftResource={leftResource} rightResource={rightResource} />);
});