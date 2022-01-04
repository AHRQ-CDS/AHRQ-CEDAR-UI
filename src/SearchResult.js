import React, { useState } from 'react';
import { Card, Button } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import strip from 'strip-markdown';
import remark from 'remark';
import _ from 'lodash';
import SearchResultTags from './SearchResultTags';

function SearchResult({ resource, onKeywordClick, onConceptClick, selectedKeywords, selectedConcepts, activeTabIndex, setActiveTabIndex }) {

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
          if(classifier.coding !== undefined) {
            concepts.push({text: text, coding: classifier.coding});
          }
          else {
            keywords.push(text);
          }
        }
      }
    }
  }

  // Sort the lists
  keywords = _.uniq(keywords).sort();
  concepts = _.orderBy(concepts, ['text'], ['asc']);

  // NOTE: When keying by classifier.text, there should not be duplicate concepts, unless UMLS uses the same name for multiple concepts.
  // concepts = _.uniqBy(concepts, 'text');

  return (
    <Card fluid id={resource.id}>
      <Card.Content>
        <Card.Header>{resource.title}</Card.Header>
        <Card.Meta>{subheaderFields.join(' - ')}</Card.Meta>
        <Card.Description>
          {showFullDescription ? <ReactMarkdown>{description}</ReactMarkdown> : truncatedDescription + '... ' }
          {showMoreButton && <Button basic compact size='mini' onClick={() => setFullDescription(!fullDescription) }>{fullDescription ? 'less' : 'more'}</Button> }
          <SearchResultTags keywords={keywords} 
                            concepts={concepts} 
                            onKeywordClick={onKeywordClick} 
                            onConceptClick={onConceptClick}
                            selectedKeywords={selectedKeywords}
                            selectedConcepts={selectedConcepts} 
                            activeTabIndex={activeTabIndex} 
                            setActiveTabIndex={setActiveTabIndex}
          />
        </Card.Description>
      </Card.Content>
      {url && <Card.Content extra><a href={url}>{url}</a></Card.Content>}
    </Card>
  );    
};

export default SearchResult;
