import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Grid, Icon, Button } from 'semantic-ui-react';
import { distance } from 'fastest-levenshtein'

function RelatedSearches({searchResults, contentSearchStrings, setContentSearchStrings, selectedKeywords, setSelectedKeywords, handleConceptSelect}) {

  const related = useMemo(() => {
    let related = []
    if (contentSearchStrings && searchResults.data) {
      const links = searchResults.data.link
      related = links.filter(link => link.relation === 'related')
        .map((link) => {
          const query = contentSearchStrings.join("")
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
  }, [contentSearchStrings, searchResults])

  // Resets search terms and initiates a concept search
  // Currently, related searches only return with Text & Keyword searches, so don't bother with Title searches
  const followRelatedSearch = useCallback((coding) => {
    contentSearchStrings.forEach((contentString) => {
      setContentSearchStrings((previousContentSearchStrings) => {return previousContentSearchStrings.filter(c => c !== contentString)});
    })
    handleConceptSelect(coding)
    window.scrollTo({top: 0, left: 0})
  })

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
