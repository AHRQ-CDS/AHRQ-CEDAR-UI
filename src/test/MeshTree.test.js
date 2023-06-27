import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import MeshTree from '../components/MeshTree';

const meshNodeExpanded = new Map();
meshNodeExpanded.set('123', '456');

it('renders without crashing', () => {
  render(<MeshTree treeNum={'123'} meshNodeExpanded={meshNodeExpanded}/>);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<MeshTree treeNum={'123'} meshNodeExpanded={meshNodeExpanded}/>);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
