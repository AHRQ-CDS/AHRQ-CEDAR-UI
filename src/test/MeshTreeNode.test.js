import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import MeshTreeNode from '../components/MeshTreeNode';
import element from '../../fixtures/element';

const meshNodeExpanded = new Map();
meshNodeExpanded.set('123', '456');

it('renders without crashing', () => {
  render(<MeshTreeNode element={element} meshNodeExpanded={meshNodeExpanded}/>);
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<MeshTreeNode element={element} meshNodeExpanded={meshNodeExpanded}/>);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
