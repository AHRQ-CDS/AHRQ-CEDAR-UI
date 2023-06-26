import React from 'react';
import { render } from '@testing-library/react';
import SortBy from '../components/SortBy';

const sortOptions = ['_score', 'quality-of-evidence']
const setSortOptions = () => void 0;

it('renders without crashing', () => {
  render(<SortBy sortOptions={sortOptions} setSortOptions={setSortOptions}/>)
});
