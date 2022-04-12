import React from 'react';
import { Button, Tab, Popup, Icon } from 'semantic-ui-react';
import ConceptCodingPopup from './ConceptCodingPopup';
import { conceptIsSelected } from '../utils/utils'

function SearchResultTags({ keywords, concepts, onKeywordClick, onConceptClick, selectedKeywords, selectedConcepts, activeTabIndex, setActiveTabIndex }) {
  const buttonProps = {
    basic: true,
    compact: true,
    size: 'mini',
  };

  const handleTabChange = (e, { activeIndex }) => {
    setActiveTabIndex(activeIndex);
  }

  const KeywordsPane = () => {
    const Keyword = (props) => {
      const selectedKeywords = props.selectedKeywords;
      const keyword = props.keyword;
      const selected = selectedKeywords && selectedKeywords.includes(keyword);

      if(selected) {
        return (
          <Button {...buttonProps} className='cursor-auto' key={keyword.text}>{keyword}
            <Icon name='check' color='blue' className='custom-icon-padding' />
          </Button>
        );
      }
      else {
        return <Button {...buttonProps} onClick={() => onKeywordClick(keyword)} key={keyword.text}>{keyword}</Button>
      }
    }

    if(keywords.length !== 0) {
      return (
        <>
          {keywords.map(k => <Keyword selectedKeywords={selectedKeywords} keyword={k} key={k} />)}
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
      const selected = conceptIsSelected(concept, selectedConcepts);

      const ConceptButton = () => {
        if(selected) {
          return (
            <Button {...buttonProps} key={concept.text} className='cursor-auto'>{concept.text}
              <Icon name='check' color='green' className='custom-icon-padding' />
            </Button>
          );
        }
        else {
          return <Button {...buttonProps} key={concept.text} onClick={() => onConceptClick(concept)}>{concept.text}</Button>;
        }
      }

      // NOTE: We must wrap the ConceptButton inside another set of tags or the Popup won't fire
      // See: https://stackoverflow.com/questions/63611315/semantics-popup-does-not-show-up-when-passing-a-custom-component-as-trigger
      return (
        <Popup key={concept.text}
               trigger={<span><ConceptButton /></span>}
               flowing
        >
          <h4>Concept: {concept.text}</h4>
          <ConceptCodingPopup concept={concept}/>
        </Popup>
      );
    }

    if(concepts.length !== 0) {
      return concepts.map((concept) => <Concept concept={concept} selectedConcepts={selectedConcepts} key={concept.text} />);
    }
    else {
      return <p>No Concepts Assigned</p>;
    }
  }

  const panes = [
    { menuItem: 'Artifact Keywords', render: () => <Tab.Pane><KeywordsPane /></Tab.Pane>},
    { menuItem: 'CEDAR Concepts', render: () => <Tab.Pane><ConceptsPane /></Tab.Pane>},
  ]

  return (
    <Tab panes={panes} menu={{ secondary: true, pointing: true }} activeIndex={activeTabIndex} onTabChange={handleTabChange} className='no-print'/>
  )
}

export default SearchResultTags;
