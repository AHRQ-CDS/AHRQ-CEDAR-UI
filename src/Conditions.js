import React, { useState } from 'react';
import { Card, Icon, List } from 'semantic-ui-react';
import moment from 'moment';
import Constants from './constants';

function Conditions({ conditions, onChange }) {

  const [selectedConditionIds, setSelectedConditionIds] = useState([]);

  const getCodeSystemName = (codeSystemUrl) => {
    let codeSystemName = Constants.CODE_SYSTEMS[codeSystemUrl];
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

      let conditionNames = []; // Names for conditions that don't include codes
      let conditionCodes = []; // Codes for conditions that include them
      conditions.filter(c => newSelectedConditionIds.includes(c.id)).forEach((condition) => {
        if(condition.code?.coding == null || condition.code?.coding?.length === 0) {
          conditionNames.push(condition.code?.text || 'unknown');
        } else {
          let coding = condition.code.coding.map(c => ({code: c.code, system: c?.system}));
          conditionCodes.push(coding);
        }
      });
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
