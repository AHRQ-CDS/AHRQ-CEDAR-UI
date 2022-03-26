import React from 'react';
import { Form, Popup, Icon } from 'semantic-ui-react';
import { SORT_BY_OPTIONS } from '../utils/constants';

function SortBy({sortByPreset, setSortByPreset}) {

  const handleSortByChange = (event) => {
    const {target} = event;
    const sortByPreset = target.value;
    setSortByPreset(sortByPreset);
  }

  return (
    <> 
      <h4>Sort By</h4>
      <Form>
        <Form.Group grouped>
          {/* "Default" sort gets an explanation popup, followed by other options */}
          {SORT_BY_OPTIONS.map((option, idx) => {
            if (idx === 0) {
              return (
                <>
                  <Form.Field
                    control='input'
                    type='radio'
                    name='sortByRadio'
                    className='normal-weight default-sort'
                    label={option}
                    key={option}
                    value={option}
                    onChange={handleSortByChange}
                    checked={sortByPreset === option }
                  />
                  <Popup trigger={<Icon name='question circle outline' color='blue' size='small' />}
                         position='right center'
                         wide
                  >
                    <p>The default sorting, in this order, sorts by:</p>
                    <ol>
                      <li>Status (active to retracted)</li>
                      <li>Publish date (most to least recent)</li>
                      <li>Strength of recommendation</li>
                      <li>Quality of evidence</li>
                    </ol>
                    <p>
                      If concepts are included in a search, results also sort 
                      by number of concept matches.
                    </p>
                  </Popup>
                </>
              )
            }
            return <Form.Field
              control='input'
              type='radio'
              name='sortByRadio'
              className='normal-weight'
              label={option}
              key={option}
              value={option}
              onChange={handleSortByChange}
              checked={sortByPreset === option }
            />
          })}
        </Form.Group>
      </Form>
    </>
  )
}

export default SortBy;