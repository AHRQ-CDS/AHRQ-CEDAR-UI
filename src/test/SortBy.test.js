import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import SortBy from '../components/SortBy';

const sortOptions = ['_score', 'quality-of-evidence']
const setSortOptions = () => void 0;

it('renders without crashing', () => {
  render(<SortBy sortOptions={sortOptions} setSortOptions={setSortOptions}/>)
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<SortBy sortOptions={sortOptions} setSortOptions={setSortOptions}/>);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
