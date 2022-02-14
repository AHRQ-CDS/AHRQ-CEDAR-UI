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
        <h5>Additional Search Concepts</h5>
        {selectedConcepts.map(concept => 
        <div className='search-tags' key={concept.text}>
          <Popup trigger={<Label color='green'><Icon name='delete' onClick={() => handleConceptRemove(concept)}/> {concept.text}</Label>} flowing hoverable>
            <h4>Concept: {concept.text}</h4>
            <ConceptCodingPopup concept={concept}/>
          </Popup>
        </div>
        )}
      </>
    )
  }


}

export default SearchConcepts;