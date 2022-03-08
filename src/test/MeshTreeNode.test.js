import React from 'react';
import MeshTreeNode from '../components/MeshTreeNode';
import { mount } from 'enzyme';
import element from '../../fixtures/element';

const meshNodeExpanded = new Map();
meshNodeExpanded.set('123', '456');


it('renders without crashing', () => {
  mount(<MeshTreeNode element={element} meshNodeExpanded={meshNodeExpanded}/>);
});