import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import SearchResult from '../components/SearchResult';
import searchResult from '../../fixtures/searchResult';

it('renders without crashing', () => {
  render(<SearchResult resource={searchResult} />);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<SearchResult resource={searchResult} />);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
