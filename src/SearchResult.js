import React, { useState } from 'react';
import { Card, Button, Grid, Segment, Divider } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import strip from 'strip-markdown';
import remark from 'remark';
<<<<<<< HEAD
<<<<<<< HEAD
import _ from 'lodash';
import Keywords from './Keywords';
=======
>>>>>>> 5c2a394 (Distinguish keywords assigned by CEDAR from others by color coding.)
=======
import _ from 'lodash';
>>>>>>> edbafee (Break concepts and keywords into two columns.)

function SearchResult({ resource, onKeywordClick }) {

  const [fullDescription, setFullDescription] = useState(false);

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

  // Grab all the keywords
  // TODO: We may want to handle MeSH keywords separately at some point
  let keywords = [];
  let concepts = [];
  for (const classification of resource.citedArtifact?.classification || []) {
    if(classification.type.coding[0].code === "keyword") {
      for (const classifier of classification.classifier || []) {
        if (classifier.text) {
          const text = classifier.text.toLowerCase();
          if(classification.whoClassified?.publisher.display === "AHRQ CEDAR") {
            concepts.push(text);
          }
          else {
            keywords.push(text);
          }
        }
      }
    }
  }

  // Deduplicate the lists
  keywords = _.uniq(keywords).sort();
  concepts = _.uniq(concepts).sort();

  return (
    <Card fluid id={resource.id}>
      <Card.Content>
        <Card.Header>{resource.title}</Card.Header>
        <Card.Meta>{subheaderFields.join(' - ')}</Card.Meta>
        <Card.Description>
          {showFullDescription ? <ReactMarkdown>{description}</ReactMarkdown> : truncatedDescription + '... ' }
          {showMoreButton && <Button basic compact size='mini' onClick={() => setFullDescription(!fullDescription) }>{fullDescription ? 'less' : 'more'}</Button> }
          <Segment>
            <Grid columns={2} relaxed='very'>
              <Grid.Column style={{paddingRight:0}}>
                <h4>Artifact Keywords</h4>
                  {keywords.map(k => <Button basic compact size='mini' key={k} onClick={() => onKeywordClick(k)}>{k}</Button>)}
              </Grid.Column>
              <Grid.Column>
                <h4>CEDAR Concepts</h4>
                  {concepts.map(k => <Button basic compact size='mini' key={k} onClick={() => onKeywordClick(k)}>{k}</Button>)}
              </Grid.Column>
            </Grid>
          </Segment>
        </Card.Description>
      </Card.Content>
      {url && <Card.Content extra><a href={url}>{url}</a></Card.Content>}
    </Card>
  );    
};

export default SearchResult;
