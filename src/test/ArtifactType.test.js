import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axe from '../setupTests';
import ArtifactType from '../components/ArtifactType';

const setSelectedArtifactTypes = () => void 0;

it('renders without crashing', () => {
    render(<ArtifactType selectedArtifactTypes={[]} setSelectedArtifactTypes={setSelectedArtifactTypes} />)
});

it('has no detected accessibility violations', async () => {
  const { container } = render(<ArtifactType selectedArtifactTypes={[]} setSelectedArtifactTypes={setSelectedArtifactTypes} />);

  await waitFor(async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
