import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { CODE_SYSTEMS } from './constants';
import { conceptIsSelected } from './utils'

function MeshTreeNode({ element, meshNodeExpanded, setMeshNodeExpanded, handleConceptSelect, selectedConcepts }) {

  const handleTreeNodeExpand = () => {
    const nodeExpanded = meshNodeExpanded.get(element.treeNumber);
    nodeExpanded !== undefined ? meshNodeExpanded.delete(element.treeNumber) : meshNodeExpanded.set(element.treeNumber, element.meshCode);

    setMeshNodeExpanded(new Map(meshNodeExpanded));
  }

  const handleTreeNodeSelect = () => {
    handleConceptSelect(getMeshConcept());
  };

  // Note: This makes the MeSH tree node look like a coded concept so there is a uniform data format for all concepts.
  const getMeshConcept = () => {
    const elementName = element.name.toLowerCase();
    return { 
      text: elementName,
      coding: [{
        system: element.system,
        code: element.meshCode,
        display: elementName
      }]
    }
  }

  const getCaretIcon = (treeNumber) => {
    if(element.indirectArtifacts > 0 ) {
      return meshNodeExpanded.get(treeNumber) !== undefined ? 'caret down' : 'caret right';
    }
    else {
      return null;
    }
  }

  const getSelectionIcon = () => {
    if(conceptIsSelected(getMeshConcept(), selectedConcepts)) {
      return (
        <Popup trigger={<Icon name="check" color="green" onClick={handleTreeNodeSelect} value={element.meshCode} />}>
          <Icon name='code'></Icon>{CODE_SYSTEMS[element.system]}: {element.meshCode} ({element.name}) added to Additional Search Concepts.
        </Popup>
      )
    }
    else {
      return (
        <Popup trigger={<Icon link name="square outline" onClick={handleTreeNodeSelect} value={element.meshCode} />}>
          Add <Icon name='code'></Icon>{CODE_SYSTEMS[element.system]}: {element.meshCode} ({element.name}) to Additional Search Concepts.
        </Popup>
      )
    }
  }

  if (element.isGlobalRoot) {
    return (
      <span>
        <div className="cursor-pointer">
          <span onClick={handleTreeNodeExpand}> 
            {element.name}
            {element.hasChildren && <Icon name={getCaretIcon(element.treeNumber)}/>}
          </span>
        </div> 
      </span>
    );
  } else if(element.directArtifacts === 0) {
    return (
      <span className="ui checkbox-spacer">
          <label onClick={handleTreeNodeExpand}>
              {element.name}
              {element.hasChildren && <Icon name={getCaretIcon(element.treeNumber)}/>}
          </label>
      </span>
    );
  }
  else {
    return (
      <span>
          {getSelectionIcon()}
          <label onClick={handleTreeNodeExpand}>
            {element.name}
            {element.hasChildren && <Icon name={getCaretIcon(element.treeNumber)}/>}
          </label>
      </span>
    );
  }
}

export default MeshTreeNode;
