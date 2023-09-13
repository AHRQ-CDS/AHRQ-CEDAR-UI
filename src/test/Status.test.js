import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import Status from '../components/Status';

const searchStatus = ['active']

it('renders without crashing', () => {
  render(<Status searchStatus={searchStatus} />);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<Status searchStatus={searchStatus} />);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});