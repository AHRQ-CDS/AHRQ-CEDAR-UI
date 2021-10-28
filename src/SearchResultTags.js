import React from 'react';
import { Button, Tab, Popup, Icon, List } from 'semantic-ui-react';
import Constants from './constants';

function SearchResultTags({ keywords, concepts, onKeywordClick }) {

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

    const ConceptCodingPopup = (props) => {
      return (
        <List size='small'>
          {props.concept.coding?.map((code, i) =>
            <List.Item key={code.code + i}><Icon name='code' key={code.code + i + "icon"} /> {Constants.CODE_SYSTEMS[code.system]}: {code.code} ({code.display})</List.Item>
          )}
        </List>
      )
    }

    if(concepts.length !== 0) {
      return (
        <>
          {
            concepts.map((concept) => {
              return(
                <Popup key={concept.text} 
                       trigger={<Button basic compact size='mini' key={concept.text} onClick={() => onKeywordClick(concept.text)}>{concept.text}</Button>} 
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