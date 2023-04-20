import React, { useEffect, useState }  from 'react';
import { List, Popup } from 'semantic-ui-react';
import _ from 'lodash';

function Publishers({searchPublisher, setSearchPublisher, setSearchPage}) {
  const [allPublishers, setAllPublishers] = useState([]);

  useEffect(() => {
    const getAllPublishers = async () => {
      const response = await fetch('../api/fhir/Organization');
      const json = await response.json();

      const data = (json.entry || []).map((entry) => ({
        id: entry.resource.id,
        name: entry.resource.name,
        alias: entry.resource.alias[0],
        description: entry.resource.extension[0].valueString
      }))
      setAllPublishers(_.orderBy(data, ['alias']));
      // Only select all publishers by default if there are no query parameters
      if(document.location.search === '') {
        setSearchPublisher(data.map((publisher) => publisher.id));
      }
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

  return (
    <>
      <h4 className="filter-header">Publishers</h4>
      <button type="button" className="btn-link" onClick={ () => setSearchPublisher(allPublishers.map((publisher) => publisher.id)) }>
        Select All
      </button>
      <List>
        {allPublishers.map((publisher) => (
          <List.Item key={publisher.id} className="pill-list-item">
            <Popup
              key={publisher.name}
              header={publisher.name}
              content={publisher.description}
              position="right center"
              trigger={
                <label>
                  <input
                    type="checkbox"
                    checked={searchPublisher.includes(publisher.id)}
                    onChange={handlePublisherChange}
                    name={publisher.alias}
                    value={publisher.id}
                  />
                  <span className="pill-list-label ui label">{publisher.alias}</span>
                </label>
              }
            />
          </List.Item>
        ))}
      </List>
    </>
  );
}

export default Publishers;
