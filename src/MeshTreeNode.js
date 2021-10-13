import React from 'react';
import { Icon } from 'semantic-ui-react';

function MeshTreeNode({ element, meshNodeExpanded, setMeshNodeExpanded, meshNodeSelected, setMeshNodeSelected }) {

  const handleTreeNodeExpand = (event) => {
    const nodeExpanded = meshNodeExpanded.get(element.treeNumber);
    nodeExpanded !== undefined ? meshNodeExpanded.delete(element.treeNumber) : meshNodeExpanded.set(element.treeNumber, element.meshCode);

    setMeshNodeExpanded(new Map(meshNodeExpanded));
  }

  const handleTreeNodeSelect = (event) => {
    const nodeChecked = meshNodeSelected.get(element.treeNumber);
    nodeChecked !== undefined ? meshNodeSelected.delete(element.treeNumber) : meshNodeSelected.set(element.treeNumber, element.meshCode);

    setMeshNodeSelected(new Map(meshNodeSelected));
  };

  const getIcon = (treeNumber, indirectArtifacts) => {
    if(element.indirectArtifacts > 0 ) {
      return meshNodeExpanded.get(treeNumber) !== undefined ? 'caret down' : 'caret right';
    }
    else {
      return null;
    }
  }

  if (element.isGlobalRoot) {
    return (
      <span>
        <div className="expander">
          <span onClick={handleTreeNodeExpand}> 
            {element.name}
            {element.hasChildren && <Icon name={getIcon(element.treeNumber)}/>}
          </span>
        </div> 
      </span>
    );
  } else if(element.directArtifacts === 0) {
    return (
      <span>
        <label onClick={handleTreeNodeExpand}>
            {element.name}
            {element.hasChildren && <Icon name={getIcon(element.treeNumber, element.indirectArtifacts)}/>}
        </label></span>
    );
  }
  else {
    return (
      <span>
        <div className='ui checkbox'>
          <input type="checkbox"
                    name={element.name}
                    onChange={handleTreeNodeSelect}
                    value={element.meshCode}
                    checked={meshNodeSelected.get(element.treeNumber) !== undefined}
                    className="custom-checkbox"
          />
          <label onClick={handleTreeNodeExpand}>
            {element.name}
            {element.hasChildren && <Icon name={getIcon(element.treeNumber, element.indirectArtifacts)}/>}
          </label>
        </div>
      </span>
    );
  }
}

export default MeshTreeNode;
