import React from 'react';
import { render } from '@testing-library/react';
import ArtifactType from '../components/ArtifactType';

it('renders without crashing', () => {
  render(<ArtifactType selectedArtifactTypes={[]} allArtifactTypes={[]} />);
});
