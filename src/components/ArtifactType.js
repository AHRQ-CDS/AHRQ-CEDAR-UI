import React, { useEffect, useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import _ from 'lodash';

function ArtifactType({selectedArtifactTypes, setSelectedArtifactTypes}) {
  const [allArtifactTypes, setAllArtifactTypes] = useState([]);
  
  useEffect(() => {
    const getAllArtifactTypes = async () => {
      const response = await fetch('../api/fhir/Citation/$get-artifact-types');
      const json = await response.json();

      const data = (json.parameter|| []).map((parameter) => ({ key: parameter.valueCoding.display, text: parameter.valueCoding.display, value: parameter.valueCoding.display }))
      const sorted_data = _.orderBy(data, ['key'])
      setAllArtifactTypes(sorted_data);
    };
    getAllArtifactTypes();
    // Cleanup logic
    return () => { setAllArtifactTypes([]) };
  }, []);

  const handleArtifactTypeChange = (event, {value}) => {
    setSelectedArtifactTypes(value);
  }

  return (
    <div className="artifact-type-select">
      <label>
        <h4>Artifact Type</h4>
        <Dropdown
          placeholder='All Artifact Types'
          name="artifactTypes"
          fluid
          multiple
          search
          selection
          clearable
          onChange={handleArtifactTypeChange}
          options={allArtifactTypes}
          value={selectedArtifactTypes}
          aria-label='artifact type choices'
        />
      </label>
    </div>
  );
}

export default ArtifactType;
