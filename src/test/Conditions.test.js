import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import Conditons from '../components/Conditions';
import conditons from '../../fixtures/conditions';

it('renders without crashing', () => {
  render(<Conditons conditions={conditons} selectedConcepts={[]} selectedKeywords={[]} />);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<Conditons conditions={conditons} selectedConcepts={[]} selectedKeywords={[]} />);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
