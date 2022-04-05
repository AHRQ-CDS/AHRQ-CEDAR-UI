import React from 'react';
import { Dropdown, Popup } from 'semantic-ui-react';
import { SORT_BY_OPTIONS } from '../utils/constants';

function SortBy({sortByPreset, setSortByPreset}) {
  const humanReadableOptions = Object.keys(SORT_BY_OPTIONS)

  const handleSortByChange = (event) => {
    const {target} = event;
    const selection = target.innerText;

    setSortByPreset(selection);
  }

  const createOptions = (options) => {
    return options.map((option) => {
      if (option === 'Default') {
        return (
          <Popup
            key={option}
            // Dropdown doesn't register Popup nested Item as onChange, handle w/ onClick instead
            trigger={<Dropdown.Item text={option} onClick={handleSortByChange}/>}
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
        )
      }
      else {
        return <Dropdown.Item key={option} text={option} />
      }
    })
  }

  return (
    <>
      <h4>Sort By</h4>
      <Dropdown
        text={sortByPreset}
        name="sortByOptions"
        fluid
        selection
        onChange={handleSortByChange}
        options={createOptions(humanReadableOptions)}
        value={sortByPreset}
      />
    </>
  )
}

export default SortBy;
