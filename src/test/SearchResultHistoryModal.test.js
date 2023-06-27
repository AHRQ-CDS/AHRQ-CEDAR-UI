import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import SearchResultHistoryModal from '../components/SearchResultHistoryModal';
import resource from '../../fixtures/searchResult';

it('renders without crashing', () => {
  render(<SearchResultHistoryModal resource={resource} />);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<SearchResultHistoryModal resource={resource} />);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
