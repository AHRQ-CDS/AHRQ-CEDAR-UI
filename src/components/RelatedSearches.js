import _ from 'lodash';
import React, { useMemo } from 'react';
import { Grid, Feed, Icon } from 'semantic-ui-react';
import { distance } from 'fastest-levenshtein'

function RelatedSearches({contentSearchStrings, searchResults}) {

  const related = useMemo(() => {
    let related = []
    if (contentSearchStrings && searchResults.data) {
      const links = searchResults.data.link
      related = links.filter(link => link.relation === 'related')
        .map((link) => {
          const query = contentSearchStrings.join("")
          const name = link.extension[0].valueCodeableConcept.coding[0].display
          return {
            distance: distance(query, name),
            display: name,
            code: link.extension[0].valueCodeableConcept.coding[0].code,
            url: link.url
          }
        })
    }

    return _.orderBy(related, 'distance', 'asc')
  }, [contentSearchStrings, searchResults])

  return (
    <>
      {related.length > 0 ? <h3>Related searches</h3> : null}
      <Grid>
        <Grid.Column width={2}/>
        <Grid.Column width={6}>
          <Feed>
            {related && related.slice(0,4).map(e => 
              <Feed.Event fluid key={e.code}>
                <Feed.Label><Icon name='search' /></Feed.Label>
                <Feed.Content>
                  <Feed.Summary><a href={e.url}>{e.display}</a></Feed.Summary>
                </Feed.Content>
              </Feed.Event>
            )}
          </Feed>
        </Grid.Column>
        <Grid.Column width={6}>
          <Feed>
            {related && related.slice(4,8).map(e => 
              <Feed.Event fluid key={e.code}>
                <Feed.Label><Icon name='search' /></Feed.Label>
                <Feed.Content>
                  <Feed.Summary><a href={e.url}>{e.display}</a></Feed.Summary>
                </Feed.Content>
              </Feed.Event>
            )}
          </Feed>
        </Grid.Column>
        <Grid.Column width={2}/>
      </Grid>
    </>
  )
}

export default RelatedSearches;
