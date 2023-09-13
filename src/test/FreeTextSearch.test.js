import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import FreeTextSearch from '../components/FreeTextSearch';

const options = [
  { key: 'Text: mental health', text: 'Text: mental health', value: 'mental health'},
  { key: 'Keyword: hypertension', text: 'Keyword: hypertension', value: 'hypertension'},
]

it('renders without crashing', () => {
  render(<FreeTextSearch searchOptions={options} />);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<FreeTextSearch searchOptions={options} />);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
