import React from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import citationParser from '../utils/citationParser';
import { Segment } from 'semantic-ui-react';
import '../assets/css/SearchResultHistory.css'

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

  const leftQualifiers = citationParser.getQualifiers(leftResource);
  const rightQualifiers = citationParser.getQualifiers(rightResource);

  const leftText = getTextDescription(leftResource);
  const rightText = getTextDescription(rightResource);

  const leftTitle = leftResource.title?.trim();
  const rightTitle = rightResource.title?.trim();

  const diffViewerProps = { splitView: true, hideLineNumbers: true };

  const anyDiffBetweenVersions =
    (leftTitle !== rightTitle) ||
    (leftKeywords !== rightKeywords) ||
    (leftConcepts !== rightConcepts) ||
    (leftStatus !== rightStatus) ||
    (leftText !== rightText) ||
    (leftQualifiers.qualityOfEvidenceStatement !== rightQualifiers.qualityOfEvidenceStatement) ||
    (leftQualifiers.qualityOfEvidenceCode !== rightQualifiers.qualityOfEvidenceCode) ||
    (leftQualifiers.strengthOfRecommendationStatement !== rightQualifiers.strengthOfRecommendationStatement)||
    (leftQualifiers.strengthOfRecommendationCode !== rightQualifiers.strengthOfRecommendationCode);

  const ReactDiffViewerWrapper = (props) => {
    return (<ReactDiffViewer oldValue={props.oldValue} newValue={props.newValue} compareMethod={props.compareMethod} {...diffViewerProps} />)
  }

  if (anyDiffBetweenVersions) {
    return (
      <div>
        {leftTitle !== rightTitle && (
          <>
            <h4>Title Changes</h4>
            <ReactDiffViewerWrapper newValue={rightTitle} oldValue={leftTitle} compareMethod="diffSentences" />
          </>
          )
        }
        {leftKeywords !== rightKeywords && (
            <>
              <h4>Keyword Changes</h4>
              <ReactDiffViewerWrapper newValue={rightKeywords} oldValue={leftKeywords} compareMethod="diffWords" />
            </>
          )
        }
        {leftConcepts !== rightConcepts && (
            <>
              <h4>Concept Changes</h4>
              <ReactDiffViewerWrapper newValue={rightConcepts} oldValue={leftConcepts} compareMethod="diffWords" />
            </>
          )
        }
        {leftStatus !== rightStatus && (
            <>
              <h4>Status Changes</h4>
              <ReactDiffViewerWrapper newValue={rightStatus} oldValue={leftStatus} compareMethod="diffWords" />
            </>
          )
        }
        {(leftQualifiers.qualityOfEvidenceStatement !== rightQualifiers.qualityOfEvidenceStatement) && (
            <>
              <h4>Quality of Evidence Statement Changes</h4>
              <ReactDiffViewerWrapper newValue={rightQualifiers.qualityOfEvidenceStatement} oldValue={leftQualifiers.qualityOfEvidenceStatement} compareMethod="diffSentences" />
            </>
          )
        }
        {(leftQualifiers.qualityOfEvidenceCode !== rightQualifiers.qualityOfEvidenceCode) && (
            <>
              <h4>Quality of Evidence Code Changes</h4>
              <ReactDiffViewerWrapper newValue={rightQualifiers.qualityOfEvidenceCode} oldValue={leftQualifiers.qualityOfEvidenceCode} compareMethod="diffSentences" />
            </>
          )
        }
        {(leftQualifiers.strengthOfRecommendationStatement !== rightQualifiers.strengthOfRecommendationStatement) && (
            <>
              <h4>Strength of Recommendation Statement Changes</h4>
              <ReactDiffViewerWrapper newValue={rightQualifiers.strengthOfRecommendationStatement} oldValue={leftQualifiers.strengthOfRecommendationStatement} compareMethod="diffSentences" />
            </>
          )
        }
        {(leftQualifiers.strengthOfRecommendationCode !== rightQualifiers.strengthOfRecommendationCode) && (
            <>
              <h4>Strength of Recommendation Code Changes</h4>
              <ReactDiffViewerWrapper newValue={rightQualifiers.strengthOfRecommendationCode} oldValue={leftQualifiers.strengthOfRecommendationCode} compareMethod="diffSentences" />
            </>
          )
        }
        {leftText !== rightText && (
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
        <div className="no-version-difference-text">No difference between versions in title, keywords, concepts, status, quality of evidence,
          strength of recommendation, or text.</div>
      </Segment>
    )
  }
}

export default SearchResultHistory;
