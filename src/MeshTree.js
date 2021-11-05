import React,{ useState, useEffect } from 'react';
import { List } from 'semantic-ui-react';
import './MeshTree.css'
import MeshTreeNode from './MeshTreeNode';

function MeshTree({ treeNum, meshNodeSelected, meshNodeExpanded, setMeshNodeSelected, setMeshNodeExpanded }) {
  const [meshChildren, setMeshChildren] = useState([]);

  useEffect(() => {
    if (meshNodeExpanded.get(treeNum) !== undefined && (!meshChildren || meshChildren.length === 0)) {
      async function getMeshChildren() {
        const response = await fetch(`/api/fhir/CodeSystem/$get-mesh-children?code=${treeNum}`);
        const json = await response.json();

        if ("parameter" in json) {
          const data = (Object.entries(json.parameter))?.map(([k, value]) => ({ 
            name: value.valueCoding.display, 
            treeNumber: value.valueCoding.extension[0].valueCode, 
            meshCode: value.valueCoding.code,
            hasChildren: value.valueCoding.extension[1].valueBoolean,
            isGlobalRoot: false,
            directArtifacts: value.valueCoding.extension[2].valueUnsignedInt,
            indirectArtifacts: value.valueCoding.extension[3].valueUnsignedInt
          }));

          setMeshChildren(data);
        }
      }
      getMeshChildren();
    }
  }, [meshNodeExpanded, meshChildren, treeNum]);

  const tree = meshChildren.map((element, i) => (
    (element.indirectArtifacts > 0 || element.directArtifacts > 0) && (
      <List key={element.treeNumber + i}>
        <List.Item key={element.treeNumber}>
          <React.Fragment>
            <MeshTreeNode element={element}
              meshNodeExpanded={meshNodeExpanded}
              setMeshNodeExpanded={setMeshNodeExpanded}
              meshNodeSelected={meshNodeSelected}
              setMeshNodeSelected={setMeshNodeSelected}
              key={meshNodeExpanded.get(element.treeNumber) + element.treeNumber + "root"}
            />
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
  )))

  return <div>{tree}</div>;
}

export default MeshTree;