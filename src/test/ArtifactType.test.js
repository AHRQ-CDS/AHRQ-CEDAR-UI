import React from 'react';
import ArtifactType from '../components/ArtifactType';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  mount(<ArtifactType selectedArtifactTypes={[]} allArtifactTypes={[]} />);
});
