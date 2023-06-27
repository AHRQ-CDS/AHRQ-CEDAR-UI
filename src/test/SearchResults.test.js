import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import SearchResults from '../components/SearchResults';
import searchResult from '../../fixtures/searchResult';

it('renders without crashing', () => {
  render(<SearchResults searchResults={searchResult} page={1} />);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<SearchResults searchResults={searchResult} page={1} />);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
