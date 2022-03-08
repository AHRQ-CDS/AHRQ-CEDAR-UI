import React from 'react';
import { Icon, List } from 'semantic-ui-react';
import { CODE_SYSTEMS } from '../utils/constants';

function ConceptCodingPopup({ concept }) {
  return (
    <List size='small'>
      {concept.coding?.map((code, i) =>
        <List.Item key={code.code + i}><Icon name='code' key={code.code + i + "icon"} /> {CODE_SYSTEMS[code.system]}: {code.code} ({code.display})</List.Item>
      )}
    </List>
  )
}

export default ConceptCodingPopup;