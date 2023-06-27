import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import Patient from '../components/Patient';
import patient from '../../fixtures/patient';

it('renders without crashing', () => {
  render(<Patient patient={patient} />);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<Patient patient={patient} />);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
