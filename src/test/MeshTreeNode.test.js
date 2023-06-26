import React from 'react';
import { render } from '@testing-library/react';
import MeshTreeNode from '../components/MeshTreeNode';
import element from '../../fixtures/element';

const meshNodeExpanded = new Map();
meshNodeExpanded.set('123', '456');

it('renders without crashing', () => {
  render(<MeshTreeNode element={element} meshNodeExpanded={meshNodeExpanded}/>);
});