import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Grid, Icon, Button } from 'semantic-ui-react';
import { distance } from 'fastest-levenshtein'

function RelatedSearches({searchResults, contentSearchStrings, setContentSearchStrings, selectedKeywords, setSelectedKeywords, handleConceptSelect}) {

  // useMemo because we want *related* to only update if any of the inputs change
  const related = useMemo(() => {
    let related = []
    if (contentSearchStrings && searchResults.data) {
      const links = searchResults.data.link
      related = links.filter(link => link.relation === 'related')
        .map((link) => {
          const query = contentSearchStrings.join("").concat(selectedKeywords.join(""))
          const concept = link.extension[0].valueCodeableConcept
          const info = link.extension[0].valueCodeableConcept.coding[0]
          return {
            distance: distance(query, info.display),
            name: info.display,
            code: info.code,
            self: concept
          }
        })
      }

      return _.orderBy(related, 'distance', 'asc')
  }, [searchResults, contentSearchStrings, selectedKeywords])

  // Resets search terms and initiates a concept search. useCallback to not re-render on each removal of search terms
  // Currently, related searches only return with Text & Keyword searches, so don't bother with Title searches
  const followRelatedSearch = useCallback((concept) => {
    contentSearchStrings.forEach((contentString) => {
      setContentSearchStrings((previousContentSearchStrings) => { return previousContentSearchStrings.filter(c => c !== contentString)});
    })
    selectedKeywords.forEach((keyword) => {
      setSelectedKeywords((previousSelectedKeywords) => { return previousSelectedKeywords.filter(k => k !== keyword) });
    })

    // blend in with concepts selected from mesh tree instead of here
    concept.coding[0].display = concept.coding[0].display.toLowerCase()
    handleConceptSelect(concept)
    window.scrollTo({top: 0, left: 0})
  }, [contentSearchStrings, setContentSearchStrings, selectedKeywords, setSelectedKeywords, handleConceptSelect])

  return (
    <>
      {related.length > 0 ? <h3>Related searches</h3> : null}
      <Grid>
        <Grid.Column width={2}/>
        <Grid.Column width={6}>
          {related && related.slice(0,4).map(concept =>
            <Button key={concept.code}
                    basic
                    fluid
                    id="related-link"
                    className="related-link"
                    onClick={() => followRelatedSearch(concept.self)}
            >
              <Icon name='search' />
              {concept.name}
            </Button>
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          {related && related.slice(4,8).map(concept =>
            <Button key={concept.code} 
                    basic
                    fluid
                    id="related-link"
                    className="related-link"
                    onClick={() => followRelatedSearch(concept.self)}
            >
              <Icon name='search' />
              {concept.name}
            </Button>
          )}
        </Grid.Column>
        <Grid.Column width={2}/>
      </Grid>
    </>
  )
}

export default RelatedSearches;
