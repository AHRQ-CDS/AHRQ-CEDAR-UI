import React, { useState, useEffect } from 'react';
import { Button, Tab, Popup } from 'semantic-ui-react';
import ConceptCodingPopup from './ConceptCodingPopup';

function SearchResultTags({ keywords, concepts, onKeywordClick, onConceptClick, conceptIsSelected, selectedKeywords, selectedConcepts }) {

  const KeywordsPane = () => {
    const Keyword = (props) => {
      const selectedKeywords = props.selectedKeywords;
      const keyword = props.keyword;
      
      const [selected, setSelected] = useState(false);

      useEffect(() => {
        if(selectedKeywords.includes(keyword)) {
          setSelected(true);
        }
        else {
          setSelected(false);
        }
      }, [selectedKeywords, keyword]);

      if(selected) {
        return  <Button compact color='blue' size='mini' key={keyword.text} className='cursor-auto'>{keyword}</Button>
      }
      else {
        return  <Button basic compact size='mini' key={keyword.text} onClick={() => onKeywordClick(keyword)}>{keyword}</Button>
      }
    }

    if(keywords.length !== 0) {
      return (
        <>
          {keywords.map(k => <Keyword selectedKeywords={selectedKeywords} keyword={k} />)}
        </>
      )
    }
    else {
      return (
        <p>No Keywords Assigned</p>
      )
    }
  }

  const ConceptsPane = () => {
    const Concept = (props) => {
      const selectedConcepts = props.selectedConcepts;
      const concept = props.concept;
      
      const [selected, setSelected] = useState(false);

      useEffect(() => {
        if(conceptIsSelected(concept)) {
          setSelected(true);
        }
        else {
          setSelected(false);
        }
      }, [selectedConcepts, concept]);

      if(selected) {
        return (
          <Popup key={concept.text} 
             trigger={<Button compact color='green' size='mini' key={concept.text} className='cursor-auto'>{concept.text}</Button>} 
             flowing 
             hoverable
          >
          <h4>Concept: {concept.text}</h4>
          <ConceptCodingPopup concept={concept}/>
          </Popup>
        )
      }
      else {
        return (
          <Popup key={concept.text} 
             trigger={<Button basic compact size='mini' key={concept.text} onClick={() => onConceptClick(concept)}>{concept.text}</Button>} 
             flowing 
             hoverable
          >
          <h4>Concept: {concept.text}</h4>
          <ConceptCodingPopup concept={concept}/>
          </Popup>
        )
      }
    }

    if(concepts.length !== 0) {
      return concepts.map((concept) => <Concept concept={concept} selectedConcepts={selectedConcepts} />);
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