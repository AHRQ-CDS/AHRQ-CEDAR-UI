import React, { useCallback } from 'react';
import { Icon, Label, Popup } from 'semantic-ui-react';
import ConceptCodingPopup from './ConceptCodingPopup';

function SearchConcepts({selectedConcepts, setSelectedConcepts, setSearchPage}) {

  // Memoize this handler so we don't re-render the search results on every overall re-render
  const handleConceptRemove = useCallback(
    (concept) => {
      setSelectedConcepts(selectedConcepts.filter(c => c !== concept));
      setSearchPage(1);
    },
    [selectedConcepts, setSearchPage, setSelectedConcepts]
  );

  if (selectedConcepts.length === 0) {
    return null;
  }
  else {
    return (
      <>
        <h3>Concepts</h3>
        {selectedConcepts.map(concept => {
          const text = concept.coding[0].display
          return (
            <span className='search-tags' key={concept.text}>
              <Popup trigger={<Label color='green'><Icon name='delete' onClick={() => handleConceptRemove(concept)}/> {text}</Label>} flowing hoverable>
                <h4>Concept: {text}</h4>
                <ConceptCodingPopup concept={concept}/>
              </Popup>
            </span>
          )
        })}
      </>
    )
  }
}

export default SearchConcepts;