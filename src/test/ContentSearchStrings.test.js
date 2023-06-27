import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import ContentSearchStrings from '../components/ContentSearchStrings';

const terms = ['acute disease', 'acute myocardial infarction', 'arrhythmia, sinus', 'arrhythmias, cardiac']
const setContentSearchStrings = () => void 0;

it('renders without crashing', () => {
  render(<ContentSearchStrings contentSearchStrings={terms} setContentSearchStrings={setContentSearchStrings}/>);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<ContentSearchStrings contentSearchStrings={terms} setContentSearchStrings={setContentSearchStrings}/>);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
