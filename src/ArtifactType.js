import React from 'react';
import { Dropdown } from 'semantic-ui-react';

function ArtifactType({selectedArtifactTypes, setSelectedArtifactTypes, allArtifactTypes}) {

  const handleArtifactTypeChange = (event, {value}) => {
    setSelectedArtifactTypes(value);
  }

  return (
    <Dropdown
      placeholder='Search for an artifact type...'
      name="artifactTypes"
      fluid
      multiple
      search
      selection
      onChange={handleArtifactTypeChange}
      options={allArtifactTypes}
      value={selectedArtifactTypes}
    />

  );
}

export default ArtifactType;
