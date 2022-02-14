import React from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import { LAST_UPDATED_PRESETS } from './constants';
import { dateStringFromPreset } from './utils';

function ArtifactLastUpdated({setLastUpdatedSearchString, setLastUpdatedPreset, lastUpdatedPreset, customDateInput, setCustomDateInput, showLastUpdatedCustomDate,
  customDatePrefix, setCustomDatePrefix, customDateError, setCustomDateError, setShowLastUpdatedCustomDate}) {

  const YYYYMMDD_REGEX = /^\d{4}-\d{2}-\d{2}$/;
  const YYYYMM_REGEX = /^\d{4}-\d{2}$/;
  const YYYY_REGEX = /^\d{4}$/;

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

  const handleLastUpdatedChange = (event) => {
    const {target} = event;
    const lastUpdatedPreset = target.value;

    setLastUpdatedPreset(lastUpdatedPreset);
    // If we change the Last Updated Radio, clear away any Custom Date that was inputted as well as associated errors.
    setCustomDateInput('');
    setCustomDateError(false);

    switch (lastUpdatedPreset) {
      case "Within 1 month":
      case "Within 3 months":
      case "Within 6 months":
      case "Within 1 year":
        setLastUpdatedSearchString(dateStringFromPreset(LAST_UPDATED_PRESETS[lastUpdatedPreset]));
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
        <Form.Group grouped>
          {Object.keys(LAST_UPDATED_PRESETS).map((key) => (
            <Form.Field
              control='input'
              type='radio'
              name='lastUpdatedRadio'
              className='normal-weight'
              label={key}
              key={key}
              value={key}
              onChange={handleLastUpdatedChange}
              checked={lastUpdatedPreset === key }
            />
          ))}
          </Form.Group>
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