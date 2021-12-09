import React from 'react';
import { Dropdown } from 'semantic-ui-react';

function ArtifactType({selectedArtifactTypes, setSelectedArtifactTypes}) {

  const artifactTypes = [
    "General Recommendation", "Research Protocol", "Technology Assessment Program Reports", "Technical Briefs", "U.S. Preventive Services Task Force Evidence Syntheses", 
    "Research Report", "Tool", "White Paper", "Systematic Review", "Guideline", "Abstract", "Series Overview", "Executive Summary", "Event-Condition-Action (ECA) rule", 
    "Data Summary", "Evidence Reports", "Consumer Summary", "Presentation", "Risk Assessment", "Specific Recommendation", "Technical Brief", "Multimodal", 
    "Smart Documentation Form", "Order Set", "Clinician Summary", "Comparative Effectiveness Reviews", "Methods Guide – Chapter", "Calculator", "Overview", 
    "Key Questions", "Surveillance Report", "Rapid Evidence Product", "Brochure", "Decision Aid", "Potential High Impact Report", "In Progress", 
    "Disposition of Comments Report", "Horizon Scan Status Update", "Alert", "Reference Information", "Policymaker Summary"
  ].sort()

  const artifactTypeOptions = artifactTypes.map(artifactTypes => (
    {
      key: artifactTypes,
      text: artifactTypes,
      value: artifactTypes,
    }
  ))

  const handleArtifactTypeChange = (event) => {
  }

  return (
    <Dropdown
      placeholder='Search for an artifact type'
      name="artifactTypes"
      fluid
      multiple
      search
      selection
      value={selectedArtifactTypes || ""}
      onChange={handleArtifactTypeChange}
      options={artifactTypeOptions}
    />

  );
}

export default ArtifactType;
