import React from 'react';
import { Icon } from 'semantic-ui-react';

function MeshTreeRoot({ element, meshNodeExpanded, setMeshNodeExpanded, meshNodeSelected, setMeshNodeSelected }) {

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

  const getIcon = (treeNumber) => {
    return meshNodeExpanded.get(treeNumber) !== undefined ? 'caret down' : 'caret right';
  }

  return (
    <span>
      { element.isGlobalRoot
        ? 
        <div className="expander">
          <span onClick={handleTreeNodeExpand}> 
            {element.name}
            { element.hasChildren && 
              <Icon name={getIcon(element.treeNumber)}/>
            }
          </span>
        </div> 
        : 
        <div className="ui checkbox" >
          <input type="checkbox"
                    name={element.name}
                    onChange={handleTreeNodeSelect}
                    value={element.meshCode}
                    checked={meshNodeSelected.get(element.treeNumber) !== undefined}
          />
          <label onClick={handleTreeNodeExpand}>
          {element.name}
          { element.hasChildren && 
            <Icon name={getIcon(element.treeNumber)}/>
          }
          </label>
        </div>
      }
    </span>
  );
}

export default MeshTreeRoot;
