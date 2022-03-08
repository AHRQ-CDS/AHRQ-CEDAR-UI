import React from 'react';
import ArtifactLastUpdated from '../components/ArtifactLastUpdated';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  mount(<ArtifactLastUpdated />);
});
