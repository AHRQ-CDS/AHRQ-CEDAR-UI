import React from 'react';
import { render } from '@testing-library/react';
import MeshTree from '../components/MeshTree';

const meshNodeExpanded = new Map();
meshNodeExpanded.set('123', '456');

it('renders without crashing', () => {
  render(<MeshTree treeNum={'123'} meshNodeExpanded={meshNodeExpanded}/>);
});
