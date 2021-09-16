import React,{ useState, useEffect } from 'react';
import { List } from 'semantic-ui-react';
import './MeshTree.css'
import MeshTreeRoot from './MeshTreeRoot';

function MeshTree({ treeNum, meshNodeSelected, meshNodeExpanded, setMeshNodeSelected, setMeshNodeExpanded }) {
  const [meshChildren, setMeshChildren] = useState([]);

  useEffect(() => {
    if (meshNodeExpanded.get(treeNum) !== undefined && (!meshChildren || meshChildren.length === 0)) {
      getMeshChildren();
    }
  });

  const getMeshChildren = async () => {
    const response = await fetch(`api/fhir/CodeSystem/$get-mesh-children?code=` + treeNum);
    const json = await response.json();

    if ("parameter" in json) {
      const data = (Object.entries(json.parameter))?.map(([k, value]) => ({ 
        name: value.valueCoding.display, 
        treeNumber: value.valueCoding.extension[0].valueCode, 
        meshCode: value.valueCoding.code,
        hasChildren: value.valueCoding.extension[1].valueBoolean,
        isGlobalRoot: false
      }));

      setMeshChildren(data);
    }
  }

  if(!meshChildren || meshChildren.length === 0) {
    return null;
  }

  else {
    return (
      meshChildren.map((element, i) => (
        <List key={element.treeNumber + i}>
          <List.Item key={element.treeNumber}>
            <React.Fragment>
              <MeshTreeRoot element={element} 
                    meshNodeExpanded={meshNodeExpanded} 
                    setMeshNodeExpanded={setMeshNodeExpanded} 
                    meshNodeSelected={meshNodeSelected} 
                    setMeshNodeSelected={setMeshNodeSelected} key={meshNodeExpanded.get(element.treeNumber) + element.treeNumber + "root"}/>
              <MeshTree
                meshNodeExpanded={meshNodeExpanded}
                meshNodeSelected={meshNodeSelected} 
                setMeshNodeExpanded={setMeshNodeExpanded} 
                setMeshNodeSelected={setMeshNodeSelected}
                treeNum={element.treeNumber}
                key={meshNodeExpanded.get(element.treeNumber) + element.treeNumber}
              />
            </React.Fragment>
          </List.Item>
        </List>
      ))
    );
  }
}

export default MeshTree;