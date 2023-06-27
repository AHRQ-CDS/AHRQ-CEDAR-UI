import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import Publishers from '../components/Publishers';

const setSearchPublisher = () => void 0;
const setSearchPage = () => void 0;

it('renders without crashing', () => {
  render(<Publishers searchPublisher={[]} setSearchPublisher={setSearchPublisher} setSearchPage={setSearchPage}/>);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<Publishers searchPublisher={[]} setSearchPublisher={setSearchPublisher} setSearchPage={setSearchPage}/>);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
