import React, { useState } from 'react';
import { Card, Button } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import SearchResultTags from './SearchResultTags';
import SearchResultHistoryModal from './SearchResultHistoryModal';
import citationParser from './citationParser';

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
  for (const classification of resource.citedArtifact?.classification || []) {
    if(classification.type.coding[0].code === "knowledge-artifact-type") {
      for (const classifier of classification.classifier || []) {
        if (classifier.text) {
           subheaderFields.push(classifier.text);
        }
      }
    }  
  }

  // Find the length nearest 300 characters to a space break
  const description = resource.citedArtifact?.abstract ? resource.citedArtifact.abstract[0].text : '';
  let textDescription = citationParser.getTextDescription(description);
  const descriptionWords = textDescription.split(/\s+/);
  let truncatedDescription = '';

  while (truncatedDescription.length < 300 && descriptionWords.length > 0) {
    truncatedDescription = `${truncatedDescription} ${descriptionWords.shift()}`;
  }

  // Should we show the full description? Show if either "more" was selected or if the truncated version fits
  const showFullDescription = fullDescription || descriptionWords.length === 0

  // Should we show the "more/less" buttons? See if there are words in the description we're not showing
  const showMoreButton = descriptionWords.length > 0

  const url = citationParser.getUrl(resource);
  const keywordsAndConcepts = citationParser.getKeywordsAndConcepts(resource);

  return (
    <Card fluid id={resource.id}>
      <Card.Content>
        <Card.Header>{resource.title}</Card.Header>
        <Card.Meta>{subheaderFields.join(' - ')}</Card.Meta>
        <Card.Description>
          {showFullDescription ? <ReactMarkdown>{description}</ReactMarkdown> : truncatedDescription + '... ' }
          {showMoreButton && <Button basic compact size='mini' onClick={() => setFullDescription(!fullDescription) }>{fullDescription ? 'less' : 'more'}</Button> }

          <SearchResultTags keywords={keywordsAndConcepts.keywords} 
                            concepts={keywordsAndConcepts.concepts} 
                            onKeywordClick={onKeywordClick} 
                            onConceptClick={onConceptClick}
                            selectedKeywords={selectedKeywords}
                            selectedConcepts={selectedConcepts} 
                            activeTabIndex={activeTabIndex} 
                            setActiveTabIndex={setActiveTabIndex}
          />
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        {url && <a href={url}>{url}</a> }
        { resource.meta?.versionId > 1 && 
          <SearchResultHistoryModal resource={resource} /> 
        }
      </Card.Content>
    </Card>
  );    
}

export default SearchResult;
