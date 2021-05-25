import React, { useState, useEffect } from 'react';
import { Card, Icon } from 'semantic-ui-react';
import moment from 'moment';

function Conditions(props) {

  const [selectedConditionIds, setSelectedConditionIds] = useState([]);

  const { conditions, onChange } = props;

  // Whenever the selected conditions change, we send up the condition names
  useEffect(() => {
    const conditionNames = conditions.filter(c => selectedConditionIds.includes(c.id)).map(c => c?.code?.text || '[unknown]');
    onChange(conditionNames);
  }, [selectedConditionIds, conditions, onChange]);

  const Condition = (props) => {
    const condition = props.condition;
    const selected = selectedConditionIds.includes(condition.id);
    const text = condition?.code?.text || '[unknown]';
    const status = condition?.clinicalStatus?.coding?.[0]?.code || '[unknown]'
    const date = condition?.recordedDate ? moment(condition.recordedDate).format('MMMM Do YYYY') : '[unknown]';

    const handleClick = (event, data) => {
      const clickedId = data.id;
      if (selectedConditionIds.includes(clickedId)) {
        setSelectedConditionIds(selectedConditionIds.filter(id => id !== clickedId));
      } else {
        setSelectedConditionIds(selectedConditionIds.concat(clickedId));
      }
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
