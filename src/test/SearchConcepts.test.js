import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import SearchConcepts from '../components/SearchConcepts';
import { concepts } from '../../fixtures/concepts';

it('renders without crashing', () => {
  render(<SearchConcepts selectedConcepts={concepts} />);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<SearchConcepts selectedConcepts={concepts} />);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
