import React from 'react';
import _ from 'lodash';
import { Segment } from 'semantic-ui-react';

function Patient(props) {
  const patient = props.patient;

  let name = '';
  if (patient && patient.name) {
    // Handle name as an array (take the first) or a singleton
    const resourceName = _.isArray(patient.name) ? patient.name[0] : patient.name;
    const names = [].concat(resourceName.prefix, resourceName.given, resourceName.family, resourceName.suffix);
    name = names.join(' ').trim();
  }

  return (
    <Segment>
      <>
        <h3>Patient</h3>
        {name}
      </>
    </Segment>
  );
}

export default Patient;
