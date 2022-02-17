import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import citationParser from './citationParser';
import { Segment } from 'semantic-ui-react';
import './SearchResultHistory.css'

function SearchResultHistory({ leftResource, rightResource }) {
  const getTextDescription = (resource) => {
    const textDescription = resource.citedArtifact?.abstract && resource.citedArtifact?.abstract[0].text ?
        resource.citedArtifact?.abstract[0].text : '';
    return citationParser.getTextDescription(textDescription).trim();
  }
  
  const leftKeywordsAndConcepts = citationParser.getKeywordsAndConcepts(leftResource);
  const rightKeywordsAndConcepts = citationParser.getKeywordsAndConcepts(rightResource);

  const leftKeywords = leftKeywordsAndConcepts.keywords.join(', ');
  const rightKeywords = rightKeywordsAndConcepts.keywords.join(', ');

  const leftConcepts = leftKeywordsAndConcepts.concepts.map(c => c?.text).join(', ') || '';
  const rightConcepts = rightKeywordsAndConcepts.concepts.map(c => c?.text).join(', ') || '';

  const leftStatus = citationParser.getStatus(leftResource);
  const rightStatus = citationParser.getStatus(rightResource);

  const leftText = getTextDescription(leftResource);
  const rightText = getTextDescription(rightResource);

  const leftTitle = leftResource.title?.trim();
  const rightTitle = rightResource.title?.trim();

  const diffViewerProps = { splitView: true, hideLineNumbers: true };

  const anyDiffBetweenVersions = (rightTitle !== leftTitle) || (rightKeywords !== leftKeywords) || (rightConcepts !== leftConcepts) || 
    (rightStatus !== leftStatus) || (rightText !== leftText);

  const ReactDiffViewerWrapper = (props) => {
    return (<ReactDiffViewer oldValue={props.oldValue} newValue={props.newValue} compareMethod={props.compareMethod} {...diffViewerProps} />)
  }

  if (anyDiffBetweenVersions) {
    return (
      <div>
        {rightTitle !== leftTitle && (
          <>
            <h4>Title Changes</h4>
            <ReactDiffViewerWrapper newValue={rightTitle} oldValue={leftTitle} compareMethod="diffSentences" />
          </>
          )
        }
        {rightKeywords !== leftKeywords && (
            <>
              <h4>Keyword Changes</h4>
              <ReactDiffViewerWrapper newValue={rightKeywords} oldValue={leftKeywords} compareMethod="diffWords" />
            </>
          )
        }
        {rightConcepts !== leftConcepts && (
            <>
              <h4>Concept Changes</h4>
              <ReactDiffViewerWrapper newValue={rightConcepts} oldValue={leftConcepts} compareMethod="diffWords" />
            </>
          )
        }
        {rightStatus !== leftStatus && (
            <>
              <h4>Status Changes</h4>
              <ReactDiffViewerWrapper newValue={rightStatus} oldValue={leftStatus} compareMethod="diffWords" />  
            </>
          )
        }
        {rightText !== leftText && (
            <>
              <h4>Text Changes</h4>
              <ReactDiffViewerWrapper newValue={rightText} oldValue={leftText} compareMethod='diffSentences' />
            </>
          )
        }
      </div>
    )
  }
  else {
    return (
      <Segment>
        <div className="no-version-difference-text">No difference between versions in title, keywords, concepts, status, or text.</div>
      </Segment>
    )
  }
}

export default SearchResultHistory;