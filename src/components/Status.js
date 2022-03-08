import React from 'react';
import { List } from 'semantic-ui-react';
import { STATUS } from '../utils/constants';

function Status({searchStatus, setSearchStatus, setSearchPage}) {
  const handleStatusChange = (event) => {
    if (event.target.checked && !searchStatus.includes(event.target.name)) {
      setSearchStatus([ ...searchStatus, event.target.name]);
      setSearchPage(1);
    }
    else if (!event.target.checked && searchStatus.includes(event.target.name)) {
      const status = searchStatus.filter(item => item !== event.target.name);
      setSearchStatus(status);
      setSearchPage(1);
    }
  };

  const handleStatusSelectAll = () => {
    setSearchStatus(STATUS);
  }

  return (
    <>
      <h4 className="filter-header">Status</h4>
      <button type="button" className="btn-link" onClick={handleStatusSelectAll}>
        Select All
      </button>
      <List>
        {STATUS.map((name) => (
          <List.Item key={name} className="pill-list-item">
            <label>
              <input type="checkbox"
                      checked={searchStatus.includes(name)}
                      onChange={handleStatusChange}
                      name={name}
              />
              <span className="pill-list-label ui label">{name}</span>
            </label>
          </List.Item>
        ))}
      </List>
    </>
  )
}

export default Status;