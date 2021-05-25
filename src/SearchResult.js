import React, { useState } from 'react';
import { Card, Button } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import strip from 'strip-markdown';
import remark from 'remark';

function SearchResult(props) {

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
    {showMoreButton && <Button basic compact size='mini' onClick={() => setFullDescription(!fullDescription) }>{fullDescription ? 'less' : 'more'}</Button> }
    </Card.Description>
      </Card.Content>
      {url && <Card.Content extra><a href={url}>{url}</a></Card.Content>}
    </Card>
  );    
};

export default SearchResult;
