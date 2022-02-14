import React from 'react';
import { Card, Icon, List, Segment } from 'semantic-ui-react';
import moment from 'moment';
import { CODE_SYSTEMS } from './constants';
import { conceptIsSelected } from './utils'

function Conditions({ conditions, handleConceptSelect, handleKeywordClick, selectedConcepts, selectedKeywords }) {
  const getCodeSystemName = (codeSystemUrl) => {
    let codeSystemName = CODE_SYSTEMS[codeSystemUrl];
    if (codeSystemName === null) {
      codeSystemName = 'Unknown';
    }
    return codeSystemName;
  }

  const Condition = (props) => {
    const condition = props.condition;
    const selectedConcepts = props.selectedConcepts;
    const selectedKeywords = props.selectedKeywords;

    const text = condition?.code?.text || '[unknown]';
    const status = condition?.clinicalStatus?.coding?.[0]?.code || '[unknown]'
    const date = condition?.recordedDate ? moment(condition.recordedDate).format('MMMM Do YYYY') : '[unknown]';

    const conditionKeyword = condition.code?.text ? condition.code.text.replace(/ *\([^)]+\)/, '').replace(/[^\w\s]+/, '').toLowerCase() : 'unknown';
    const getConditionConcept = () => {
      let codes = [];

      for(const code of condition.code.coding) {
        codes.push({code: code.code, system: code.system, display: code.display});
      }
      const text = condition.code.text !== undefined ? condition.code.text : codes[0].display;
      return {text: text.toLowerCase(), coding: codes};
    }

    const conditionConcept = getConditionConcept();
    const selected = selectedKeywords.includes(conditionKeyword) || conceptIsSelected(conditionConcept, selectedConcepts);

    const handleClick = () => {
      if(!condition.code?.coding || condition.code?.coding?.length === 0) {
        handleKeywordClick(conditionKeyword);
      }
      else {
        handleConceptSelect(conditionConcept)
      }
    }

    return (
      <Card fluid id={condition.id} value={condition} onClick={!selected ? handleClick : undefined}>
        <Card.Content>
          <Card.Header>{text} {selected ? <Icon name='check' color='green' /> : null}</Card.Header>
          <Card.Meta>{date} [{status}]</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <List size='mini'>
            {condition.code?.coding?.map(c => <List.Item key={c.code}><Icon name='code' /> {getCodeSystemName(c.system)}: {c.code} ({c.display})</List.Item>)}
          </List>
        </Card.Content>
      </Card>
    );
  };

  return (
      <>
        <Segment>
          <h3>Conditions</h3>
          {conditions.map(c => 
            <Condition key={c.id} 
                       condition={c} 
                       handleConceptSelect={handleConceptSelect}
                       handleKeywordClick={handleKeywordClick}
                       selectedConcepts={selectedConcepts}
                       selectedKeywords={selectedKeywords}
            />
          )}
        </Segment>
      </>
  );
}

export default Conditions;
