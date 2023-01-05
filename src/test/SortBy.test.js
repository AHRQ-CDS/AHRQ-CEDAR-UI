import React from 'react';
import SortBy from '../components/SortBy';
import { mount } from 'enzyme';

const sortOptions = ['_score', 'quality-of-evidence']
const setSortOptions = () => void 0;

it('renders without crashing', () => {
  mount(<SortBy sortOptions={sortOptions} setSortOptions={setSortOptions}/>)
});
