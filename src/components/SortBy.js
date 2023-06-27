import React, { useMemo } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { SORT_BY_OPTIONS } from '../utils/constants';

function SortBy({sortOptions, setSortOptions}) {

  const humanReadableOptions = Object.keys(SORT_BY_OPTIONS);
  const options = useMemo(() => {
    return humanReadableOptions.map(option => {
      return { key: option, text: option, value: SORT_BY_OPTIONS[option] }
    })
  }, [humanReadableOptions])

  const handleSortByChange = (event, {value}) => {
    setSortOptions(value)
  }

  return (
    <>
      <h4>Sort By</h4>
      <Dropdown
        placeholder="Default"
        name="sortByOptions"
        aria-label="'sort by' options"
        fluid
        multiple
        selection
        clearable
        onChange={handleSortByChange}
        options={options}
        value={sortOptions}
      />
    </>
  )
}

export default SortBy;
