import React, { useState, useEffect, useCallback } from 'react';
import { Card, Icon, List } from 'semantic-ui-react';
import moment from 'moment';
import Constants from './constants';
import _ from 'lodash';

function Conditions({ conditions, handleSelectConcepts, handleKeywordClick, selectedConcepts, selectedKeywords, conceptIsSelected }) {

  const getCodeSystemName = (codeSystemUrl) => {
    let codeSystemName = Constants.CODE_SYSTEMS[codeSystemUrl];
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

    const [selected, setSelected] = useState(false);

    const getConditionKeyWord = useCallback(
      () => {
        return condition.code?.text ? condition.code.text.replace(/ *\([^)]+\)/, '').replace(/[^\w\s]+/, '').toLowerCase() : 'unknown';
      },
      [condition.code.text]
    );

    const getConditionConcept = useCallback(
      () => {
        let codes = [];

        for(const code of condition.code.coding) {
          codes.push({code: code.code, system: code.system, display: code.display});
        }
        const text = condition.code.text !== undefined ? condition.code.text : codes[0].display;
        return {text: text.toLowerCase(), coding: codes};
      },
      [condition.code.coding, condition.code.text]
    );

    useEffect(() => {     
      _.isEmpty(getConditionConcept()) && selectedKeywords.includes(getConditionKeyWord()) ? setSelected(true) : setSelected(false);

    }, [selectedKeywords, getConditionConcept, getConditionKeyWord]);

    useEffect(() => {
      const conditionConcept = getConditionConcept();
      
      !_.isEmpty(conditionConcept) && conceptIsSelected(conditionConcept) ? setSelected(true) : setSelected(false);

    }, [selectedConcepts, getConditionConcept]);

    const handleClick = () => {
      if(!condition.code?.coding || condition.code?.coding?.length === 0) {
        handleKeywordClick(getConditionKeyWord());
      }
      else {
        handleSelectConcepts(getConditionConcept())
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
      <React.Fragment>
        {conditions.map(c => 
          <Condition key={c.id} 
                     condition={c} 
                     handleSelectConcepts={handleSelectConcepts}
                     handleKeywordClick={handleKeywordClick}
                     selectedConcepts={selectedConcepts}
                     selectedKeywords={selectedKeywords}
          />
        )}
      </React.Fragment>
  );
}

export default Conditions;
