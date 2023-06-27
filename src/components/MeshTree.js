import React,{ useState, useEffect } from 'react';
import { List } from 'semantic-ui-react';
import '../assets/css/MeshTree.css'
import MeshTreeNode from './MeshTreeNode';

function MeshTree({ treeNum, meshNodeExpanded, setMeshNodeExpanded, handleConceptSelect, selectedConcepts }) {
  const [meshChildren, setMeshChildren] = useState([]);

  useEffect(() => {
    if (meshNodeExpanded.get(treeNum) !== undefined && (!meshChildren || meshChildren.length === 0)) {
      async function getMeshChildren() {
        const response = await fetch(`../api/fhir/CodeSystem/$get-mesh-children?code=${treeNum}`);
        const json = await response.json();

        if ("parameter" in json) {
          const data = (Object.entries(json.parameter))?.map(([, value]) => ({
            name: value.valueCoding.display, 
            treeNumber: value.valueCoding.extension[0].valueCode, 
            meshCode: value.valueCoding.code,
            system: value.valueCoding.system,
            hasChildren: value.valueCoding.extension[1].valueBoolean,
            isGlobalRoot: false,
            directArtifacts: value.valueCoding.extension[2].valueUnsignedInt,
            indirectArtifacts: value.valueCoding.extension[3].valueUnsignedInt
          }));

          setMeshChildren(data);
        }
      }
      getMeshChildren();
      // Cleanup logic
      return () => { setMeshChildren([]) };
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
              key={meshNodeExpanded.get(element.treeNumber) + element.treeNumber + "root"}
              handleConceptSelect={handleConceptSelect}
              selectedConcepts={selectedConcepts}
            />
            <MeshTree
              meshNodeExpanded={meshNodeExpanded}
              setMeshNodeExpanded={setMeshNodeExpanded}
              treeNum={element.treeNumber}
              key={meshNodeExpanded.get(element.treeNumber) + element.treeNumber}
              handleConceptSelect={handleConceptSelect}
              selectedConcepts={selectedConcepts}
            />
          </React.Fragment>
        </List.Item>
      </List>
  )))

  return <div>{tree}</div>;
}

export default MeshTree;
