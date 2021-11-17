import React from 'react';
import { Button, Tab, Popup } from 'semantic-ui-react';
import ConceptCodingPopup from './ConceptCodingPopup';

function SearchResultTags({ keywords, concepts, onKeywordClick, onConceptClick, conceptIsSelected }) {

  const KeywordsPane = () => {
    if(keywords.length !== 0) {
      return (
        <>
          {keywords.map(k => <Button basic compact size='mini' key={k} onClick={() => onKeywordClick(k)}>{k}</Button>)}
        </>
      )
    }
    else {
      return (
        <p>No Keywords Assigned</p>
      )
    }
  };

  const ConceptsPane = () => {
    const getConceptButton = (concept) => {
      if(conceptIsSelected(concept)) {
        return <Button basic compact color='green' size='mini' key={concept.text} onClick={() => onConceptClick(concept)}>{concept.text}</Button>
      }
      else {
        return <Button basic compact size='mini' key={concept.text} onClick={() => onConceptClick(concept)}>{concept.text}</Button>
      }
    }

    if(concepts.length !== 0) {
      return (
        <>
          {
            concepts.map((concept) => {
              return(
                <Popup key={concept.text} 
                       trigger={getConceptButton(concept)} 
                       flowing 
                       hoverable
                >
                  <h4>Concept: {concept.text}</h4>
                  <ConceptCodingPopup concept={concept}/>
                </Popup>
              )
            })
          }
        </>
      );
    }
    else {
      return (
        <p>No Concepts Assigned</p>
      );
    }

  }

  const panes = [
    { menuItem: 'Artifact Keywords', render: () => <Tab.Pane><KeywordsPane /></Tab.Pane>},
    { menuItem: 'CEDAR Concepts', render: () => <Tab.Pane><ConceptsPane /></Tab.Pane>},
  ]

  return (
    <Tab panes={panes} menu={{ secondary: true, pointing: true }} />
  )
}

export default SearchResultTags;