import React, { useState } from 'react';
import { Card, Icon, List } from 'semantic-ui-react';
import moment from 'moment';

function Conditions({ conditions, onChange }) {

  const [selectedConditionIds, setSelectedConditionIds] = useState([]);

  const CODE_SYSTEMS = {
    'http://snomed.info/sct': 'SNOMED-CT'
  }

  const getCodeSystemName = (codeSystemUrl) => {
    let codeSystemName = CODE_SYSTEMS[codeSystemUrl];
    if (codeSystemName === null) {
      codeSystemName = 'Unknown';
    }
    return codeSystemName;
  }

  const Condition = (props) => {
    const condition = props.condition;
    const selected = selectedConditionIds.includes(condition.id);
    const text = condition?.code?.text || '[unknown]';
    const status = condition?.clinicalStatus?.coding?.[0]?.code || '[unknown]'
    const date = condition?.recordedDate ? moment(condition.recordedDate).format('MMMM Do YYYY') : '[unknown]';

    const handleClick = (event, data) => {
      const clickedId = data.id;
      let newSelectedConditionIds = null;
      if (selectedConditionIds.includes(clickedId)) {
        newSelectedConditionIds = selectedConditionIds.filter(id => id !== clickedId);
      } else {
        newSelectedConditionIds = selectedConditionIds.concat(clickedId);
      }
      setSelectedConditionIds(newSelectedConditionIds);
      const newSelectedConditions = conditions.filter(c => newSelectedConditionIds.includes(c.id));
      // Get names for conditions that don't include codes
      const conditionsWithoutCodes = newSelectedConditions.filter(c => (c.code?.coding == null || c.code?.coding?.length === 0));
      const conditionNames = conditionsWithoutCodes.map(c => c.code?.text || '[unknown]');
      // For each condition with codes, extract them
      const conditionsWithCodes = newSelectedConditions.filter(c => c.code?.coding?.length > 0);
      const conditionCodes = conditionsWithCodes.map(condition => condition.code.coding.map(
        coding => ({code: coding.code, system: coding?.system})));
      onChange(conditionNames, conditionCodes);
    };

    return (
      <Card fluid id={condition.id} onClick={handleClick}>
        <Card.Content>
          <Card.Header>{text} {selected ? <Icon name='check' /> : null}</Card.Header>
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
        {conditions.map(c => <Condition key={c.id} condition={c} />)}
      </React.Fragment>
  );
}

export default Conditions;
