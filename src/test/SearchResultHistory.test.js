import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import SearchResultHistory from '../components/SearchResultHistory';
import searchResult from '../../fixtures/searchResult';

const leftResource = searchResult;
const rightResource = searchResult;

it('renders without crashing', () => {
  render(<SearchResultHistory leftResource={leftResource} rightResource={rightResource} />);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<SearchResultHistory leftResource={leftResource} rightResource={rightResource} />);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
