import React, { useState } from 'react';
import { Card, Icon } from 'semantic-ui-react';
import moment from 'moment';

function Conditions({ conditions, onChange }) {

  const [selectedConditionIds, setSelectedConditionIds] = useState([]);

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
      const conditionNames = conditions.filter(c => newSelectedConditionIds.includes(c.id)).map(c => c?.code?.text || '[unknown]');
      onChange(conditionNames);
    };

    return (
      <Card fluid id={condition.id} onClick={handleClick}>
        <Card.Content>
          <Card.Header>{text} {selected ? <Icon name='check' /> : null}</Card.Header>
          <Card.Meta>{date} [{status}]</Card.Meta>
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
