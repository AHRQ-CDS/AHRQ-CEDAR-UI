import React, { useEffect, useState }  from 'react';
import { List } from 'semantic-ui-react';
import _ from 'lodash';

function Publishers({searchPublisher, setSearchPublisher, setSearchPage}) {
  const [allPublishers, setAllPublishers] = useState([]);

  useEffect(() => {
    const getAllPublishers = async () => {
      const response = await fetch('/api/fhir/Organization');
      const json = await response.json();

      const data = (json.entry || []).map((entry) => ({ id: entry.resource.id, name: entry.resource.name, alias: entry.resource.alias[0] }))
      const sorted_data = _.orderBy(data, ['alias'])
      setAllPublishers(sorted_data);
      setSearchPublisher(sorted_data.map((publisher) => publisher.id));
    };
    getAllPublishers();
  }, [setSearchPublisher]);

  const handlePublisherChange = (event) => {
    if (event.target.checked && !searchPublisher.includes(event.target.value)) {
      setSearchPublisher([ ...searchPublisher, event.target.value]);
      setSearchPage(1);
    }
    else if (!event.target.checked && searchPublisher.includes(event.target.value)) {
      const publisher = searchPublisher.filter(item => item !== event.target.value);
      setSearchPublisher(publisher);
      setSearchPage(1);
    }
  }

  const handlePublisherSelectAll = () => {
    setSearchPublisher(allPublishers.map((publisher) => publisher.id));
  }

  return (
    <>
      <h4 className="filter-header">Publishers</h4>
      <button type="button" className="btn-link" onClick={handlePublisherSelectAll}>
        Select All
      </button>
      <List>
        {allPublishers.map((publisher) => (
          <List.Item key={publisher.id} className="pill-list-item">
            <label>
              <input type="checkbox"
                    checked={searchPublisher.includes(publisher.id)}
                    onChange={handlePublisherChange}
                    name={publisher.alias}
                    value={publisher.id}
                  
              />
              <span data-tooltip={publisher.name} data-position="right center" 
                className="pill-list-label ui label">
                {publisher.alias}
              </span>
            </label>
          </List.Item>
        ))}
      </List>
    </>
  );
}

export default Publishers;