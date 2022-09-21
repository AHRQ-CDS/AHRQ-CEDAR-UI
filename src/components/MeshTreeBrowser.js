import React, { useEffect, useState} from 'react';
import { List } from 'semantic-ui-react';
import MeshTree from './MeshTree';
import MeshTreeNode from './MeshTreeNode';

function MeshTreeBrowser({handleConceptSelect, selectedConcepts}) {
  const [meshRoots, setMeshRoots] = useState([]);
  const [meshNodeExpanded, setMeshNodeExpanded] = useState(new Map());

  useEffect(() => {
    const getMeshRoots = async () => {
      const response = await fetch('../api/fhir/CodeSystem/$get-mesh-children');
      const json = await response.json();
      const data = (Object.entries(json.parameter) || []).map(([, value]) =>
      (
        {  
          name: value.valueCoding.display,
          treeNumber: value.valueCoding.extension[0].valueCode,
          meshCode: null,
          system: value.valueCoding.system,
          isGlobalRoot: true,
          hasChildren: value.valueCoding.extension[1].valueBoolean,
          directArtifacts: value.valueCoding.extension[2].valueUnsignedInt,
          indirectArtifacts: value.valueCoding.extension[3].valueUnsignedInt
        }
      ));

      setMeshRoots(data);
    }
    
    getMeshRoots();
  }, []);

  if (!meshRoots) {
    return null;
  }
  else {
    return (
      <>
        <h3>Browse MeSH</h3>
        {meshRoots.map((element, i) => (
          <List key={element.treeNumber + i}>
            {(element.indirectArtifacts > 0) &&
            <List.Item key={element.treeNumber}>
              <>
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
                  key={meshNodeExpanded.get(element.treeNumber) + element.treeNumber + "tree"}
                  treeNum={element.treeNumber}
                  handleConceptSelect={handleConceptSelect}
                  selectedConcepts={selectedConcepts}
                />
              </>
            </List.Item>
            }
          </List>
        ))
        } 
      </>
    )
  }
}

export default MeshTreeBrowser;