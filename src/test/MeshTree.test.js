import React from 'react';
import MeshTree from '../components/MeshTree';
import { mount } from 'enzyme';

const meshNodeExpanded = new Map();
meshNodeExpanded.set('123', '456');

it('renders without crashing', () => {
  mount(<MeshTree treeNum={'123'} meshNodeExpanded={meshNodeExpanded}/>);
});
