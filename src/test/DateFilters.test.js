import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import DateFilters from '../components/DateFilters';

it('renders without crashing', () => {
  render(<DateFilters />);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<DateFilters />);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
