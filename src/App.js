import React, { useState, useEffect } from 'react';
import { SMART } from './FHIRClientWrapper';
import { Container, Grid, Segment, Card, Icon, Menu } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import strip from 'strip-markdown';
import remark from 'remark';
import './App.css';

function App(props) {

  const [patient, setPatient] = useState();
  const [conditions, setConditions] = useState([]);
  const [selectedConditionIds, setSelectedConditionIds] = useState([]);
  const [searchResults, setSearchResults] = useState();

  const cedarSearch = async (searchStrings) => {
    // TODO parenthisis handling is a temporary workaround for conditions like "Acute bronchitis (disorder)"
    // TODO punctuation handling is a temporary workaround for conditions like "Alzheimer's"
    const searchString = searchStrings.map(s => `"${s.replace(/\([^)]+\)/, '').replace(/[^\w\s]+/, '')}"`).join(' AND ');
    const response = await fetch(`http://127.0.0.1:4567/fhir/Citation?_content=${searchString}&artifact-current-state=active`);
    const json = await response.json();
    // TODO need to see if search is still relevant (e.g. long running search might come after other items clicked
    // idea: for each search, increment a "most recent search" counter and don't set search results if the counter has moved on from this search
    setSearchResults(json);
  };

  useEffect(() => {
    // If we're running in a SMART on FHIR context, load the patient and all resources
    if (props.smart) {
      SMART.load().then(([user, patient, conditions]) => {
        // TODO: Remove user if we don't need it?
        setPatient(patient);
        setConditions(conditions);
      });
    }
  }, [props.smart]);

  useEffect(() => {
    // TODO: pre-process conditions to be id/name pairs and just do everything with those
    const conditionNames = conditions.filter(c => selectedConditionIds.includes(c.id)).map(c => c.code.text);
    cedarSearch(conditionNames);
  }, [conditions, selectedConditionIds]);

  let name = '';
  if (patient && patient.name) {
    // Handle name as an array (take the first) or a singleton
    let resourceName = _.isArray(patient.name) ? patient.name[0] : patient.name;
    let names = [];
    // TODO: all as part of same concat
    names = names.concat(resourceName.prefix);
    names = names.concat(resourceName.given);
    names = names.concat(resourceName.family);
    names = names.concat(resourceName.suffix);
    name = names.join(' ').trim();
  }

  // TODO: move this and decouple
  const Condition = (props) => {
    const condition = props.condition;
    const selected = selectedConditionIds.includes(condition.id);
    const text = condition?.code?.text || '[unknown]';
    const status = condition?.clinicalStatus?.coding?.[0]?.code || '[unknown]'
    const date = condition?.recordedDate ? moment(condition.recordedDate).format('MMMM Do YYYY') : '[unknown]';
    const handleClick = (event, data) => {
      const clickedId = data.id;
      if (selectedConditionIds.includes(clickedId)) {
        setSelectedConditionIds(selectedConditionIds.filter(id => id !== clickedId));
      } else {
        setSelectedConditionIds(selectedConditionIds.concat(clickedId));
      }
    };
    return (
      <Card fluid id={condition.id} onClick={handleClick}>
        <Card.Content>
          <Card.Header>{text} {selected ? <Icon name='check' /> : null}</Card.Header>
          <Card.Meta>{date} [{status}]</Card.Meta>
        </Card.Content>
      </Card>
    );
  };

  const SearchResult = (props) => {

    const [fullDescription, setFullDescription] = useState(false);

    const resource = props.resource;

    // Put publisher and date in subheader in a way that supports either being missing
    let subheaderFields = [];
    if (resource.citedArtifact?.publicationForm[0].publishedIn?.publisher?.display) {
      subheaderFields.push(resource.citedArtifact.publicationForm[0].publishedIn.publisher.display);
    }
    if (resource.citedArtifact?.publicationForm[0].articleDate) {
      subheaderFields.push(resource.citedArtifact.publicationForm[0].articleDate);
    }

    // Find the length nearest 300 characters to a space break
    const description = resource.citedArtifact?.abstract ? resource.citedArtifact.abstract[0].text : '';
    let textDescription = '';
    remark().use(strip).process(description, (err, file) => textDescription = String(file))
    const descriptionWords = textDescription.split(/\s+/);
    let truncatedDescription = '';
    while (truncatedDescription.length < 300 && descriptionWords.length > 0) {
      truncatedDescription = `${truncatedDescription} ${descriptionWords.shift()}`;
    }

    // Should we show the full description? Show if either "more" was selected or if the truncated version fits
    const showFullDescription = fullDescription || descriptionWords.length === 0

    // Should we show the "more/less" buttons? See if there are words in the description we're not showing
    const showMoreButton = descriptionWords.length > 0

    const url = resource?.citedArtifact?.webLocation?.[0]?.url;

    return (
      <Card fluid id={resource.id}>
        <Card.Content>
          <Card.Header>{resource.title}</Card.Header>
          <Card.Meta>{subheaderFields.join(' - ')}</Card.Meta>
          <Card.Description>
          {showFullDescription ? <ReactMarkdown>{description}</ReactMarkdown> : truncatedDescription + '... ' }
          {showMoreButton && <a onClick={() => setFullDescription(!fullDescription) }>{fullDescription ? 'less' : 'more'}</a> }
        </Card.Description>
        </Card.Content>
        {url && <Card.Content extra><a href={url}>{url}</a></Card.Content>}
      </Card>
    );    
  };
  
  const SearchResults = (props) => {
    if (props.searchResults) {
      return (
        <div>
          <h4>{props.searchResults.total} Search Results</h4>
          {props.searchResults.entry && props.searchResults.entry.map(e => <SearchResult key={e.resource.id} resource={e.resource} />)}
        </div>
      );
    }
    return <div>Nada</div>;
  }

  return (
    <div className="App">
      <Menu color='blue' inverted attached>
        <Menu.Item header><h2>CEDAR SMART Demonstration</h2></Menu.Item>
      </Menu>

      <Container fluid>
        <Grid>
          <Grid.Row>
            <Grid.Column width={5}>
              <Segment>
                <h4>Patient</h4>
                {name}
              </Segment>
              <Segment>
                <h4>Conditions</h4>
                {conditions.map(c => <Condition key={c.id} condition={c} />)}
              </Segment>
            </Grid.Column>
            <Grid.Column width={11}>
              <Segment>
                <SearchResults searchResults={searchResults} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

    </div>
  );
}

export default App;
