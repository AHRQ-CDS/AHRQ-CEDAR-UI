import React from 'react';
import MeshTreeRoot from './MeshTreeRoot';
import { mount } from 'enzyme';
import element from '../fixtures/element';

const meshNodeExpanded = new Map();
meshNodeExpanded.set('123', '456');


it('renders without crashing', () => {
  mount(<MeshTreeRoot element={element} meshNodeExpanded={meshNodeExpanded}/>);
});