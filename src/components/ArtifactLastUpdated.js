import React from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import { LAST_UPDATED_PRESETS } from '../utils/constants';
import { dateStringFromPreset } from '../utils/utils';

function ArtifactLastUpdated({setLastUpdatedSearchString, lastUpdatedPreset, setLastUpdatedPreset, customDateInput, setCustomDateInput, showLastUpdatedCustomDate, setShowLastUpdatedCustomDate,
  customDatePrefix, setCustomDatePrefix, customDateError, setCustomDateError}) {

  const YYYYMMDD_REGEX = /^\d{4}-\d{2}-\d{2}$/;
  const YYYYMM_REGEX = /^\d{4}-\d{2}$/;
  const YYYY_REGEX = /^\d{4}$/;

  const LAST_UPDATED_SELECT_OPTIONS = [
    { key: 'Any time', value:  'Any time', text: 'Any time' },
    { key: 'Within 1 month', value: 'Within 1 month', text: 'Within 1 month' },
    { key: 'Within 3 months', value: 'Within 3 months', text: 'Within 3 months' },
    { key: 'Within 1 year', value: 'Within 1 year', text: 'Within 1 year'},
    { key: 'Custom', value: 'Custom', text: 'Custom'}
  ]

  const LAST_UPDATED_CUSTOM_PREFIXES = [
    {
      key: "eq",
      text: "On",
      value: "eq"
    },
    {
      key: "le",
      text: "On or before",
      value: "le"
    },
    {
      key: "ge",
      text: "On or after",
      value: "ge"
    },
  ]

  const handleLastUpdatedChange = (event, data) => {
    setLastUpdatedPreset(event.target.textContent);
    // If we change the Last Updated Select, clear away any Custom Date that was inputted as well as associated errors.
    setCustomDateInput('');
    setCustomDateError(false);

    switch (event.target.textContent) {
      case "Within 1 month":
      case "Within 3 months":
      case "Within 6 months":
      case "Within 1 year":
        setLastUpdatedSearchString(dateStringFromPreset(LAST_UPDATED_PRESETS[data.value]));
        setShowLastUpdatedCustomDate(false);
        break;
      case "Custom":
        setLastUpdatedSearchString('');
        setShowLastUpdatedCustomDate(true);
        break;
      // Default is "Anytime", that is, no date filter
      default: 
        setLastUpdatedSearchString('');
        setShowLastUpdatedCustomDate(false);
        break;
    }
  }

  const updateCustomDate = (event) => {
    event.preventDefault();

    const {target} = event;

    if (target.customDate.value !== '') {
      if(dateMatchesValidRegex(target.customDate.value) !== null) {
        setLastUpdatedSearchString(`${customDatePrefix}${target.customDate.value}`);
      }
      else {
        setCustomDateError(true);
      }
    }
  }

  const dateMatchesValidRegex = (dateString) => {
    return dateString.match(YYYYMMDD_REGEX) || dateString.match(YYYYMM_REGEX) || dateString.match(YYYY_REGEX);
  }

  return (
    <> 
      <h4>Artifact Last Updated</h4>
      <Form error onSubmit={updateCustomDate}>
        <Form.Select
          selection
          name="type"
          options={LAST_UPDATED_SELECT_OPTIONS}
          value={lastUpdatedPreset}
          onChange={(e, data) => handleLastUpdatedChange(e, data)}
        />
          { showLastUpdatedCustomDate &&
            <>
            <Form.Group>
              <Form.Select
                selection
                name="type"
                options={LAST_UPDATED_CUSTOM_PREFIXES}
                value={customDatePrefix}
                width={5}
                style={{minWidth:"10em"}}
                onChange={(e, data) => setCustomDatePrefix(data.value)}
              />
              <Form.Input
                type='text'
                name='customDate'
                placeholder='Custom date...'
                value={customDateInput}
                onChange={(e) => setCustomDateInput(e.target.value)}
                width={7}
              />
              <Button primary type="submit">Apply Date</Button>
            </Form.Group>
              {customDateError ? <Message error content='Date format is invalid. Format as YYYY-MM-DD, YYYY-MM, or YYYY.'/>
                               : <small className="helper">*Format custom date as YYYY-MM-DD, YYYY-MM, or YYYY.</small>
              }
            </>
          }
        </Form>
    </>
  )
}

export default ArtifactLastUpdated;