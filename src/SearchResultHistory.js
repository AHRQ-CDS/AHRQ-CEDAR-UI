import React, { useState }  from 'react';
import { Button, Icon, Loader, Modal, Popup  } from 'semantic-ui-react';
import { StringDiff } from 'react-string-diff';
import citationParser from './citationParser';
import _ from 'lodash';
import moment from 'moment'

function SearchResultHistory({ currentResource, currentKeywords, currentConcepts, currentText }) {

	const [open, setOpen] = useState(false);
	const [previousResource, setPreviousResource] = useState({ status: 'none' });
	const currentResourceId = currentResource.meta.versionId;
	const resourceId = currentResource.id; 
	
	const openModal = () => {
		setPreviousResource({ status: 'pending' });
		
    async function getPreviousResource() {
			const previousResourceId = currentResourceId - 1;
      const response = await fetch(`/api/fhir/Citation/${resourceId}/_history/${previousResourceId}`);
      const json = await response.json();
      
      setPreviousResource({ status: 'complete', data: json });
    }

 		getPreviousResource();
    setOpen(true);
	}

	const VersionDiff = () => {
		if (previousResource?.status === 'pending') {
    	return <div><Loader active content='Loading' /></div>;
  	}
  	else if (previousResource?.status === 'complete') {
      if(previousResource.data) {
        const previousKeywordsAndConcepts = citationParser.getKeywordsAndConcepts(previousResource.data);
        const previousDescription = previousResource.data.citedArtifact.abstract ? previousResource.data.citedArtifact.abstract[0].text : '';
        const previousText = citationParser.getTextDescription(previousDescription);

        return (
          <div>
            <div className="latest-version-header">
              <span className="latest-version-date">{previousResource.data.date}
                <span className="latest-version-number">{moment.localeData().ordinal(previousResource.data.meta.versionId)} version</span>
              </span> <Icon name='arrow right'/>
              <span className="latest-version-date">{currentResource.date}
                <span className="latest-version-number">{moment.localeData().ordinal(currentResource.meta.versionId)} version</span>
              </span> 
            </div>
            <Icon name='square' size='small' className="latest-artifact-additions"/> Latest additions
            <Icon name='square' size='small' className="latest-artifact-deletions latest-artifact-legend"/> Latest deletions
            { previousResource.data.title !== currentResource.title && (
              <>
                <h4>Title Changes</h4>
                <StringDiff method='diffSentences' 
                            oldValue={previousResource.data.title} 
                            newValue={currentResource.title} />
              </>
              )
            }
            { !_.isEqual(previousKeywordsAndConcepts.keywords, currentKeywords) && (
                <>
                  <h4>Keyword Changes</h4>
                  <StringDiff method='diffSentences' 
                              oldValue={previousKeywordsAndConcepts.keywords.join(', ')} 
                              newValue={currentKeywords.join(', ')} />  
                </>
              )
            }
            { !_.isEqual(previousKeywordsAndConcepts.concepts, currentConcepts) && (
                <>
                  <h4>Concept Changes</h4>
                  <StringDiff method='diffSentences' 
                              oldValue={previousKeywordsAndConcepts.concepts.map(c => c?.text).join(', ') || ''} 
                              newValue={currentConcepts.map(c => c?.text).join(', ') || ''} />
                </>
              )
            }
            {
              previousResource.data.citedArtifact.currentState[0].coding[0].code !== currentResource.citedArtifact.currentState[0].coding[0].code && (
                <>
                  <h4>Status Changes</h4>
                  <StringDiff method='diffSentences' 
                              oldValue={previousResource.data.citedArtifact.currentState[0].coding[0].code} 
                              newValue={currentResource.citedArtifact.currentState[0].coding[0].code} />  
                </>
              )
            }
            { previousText !== currentText && (
                <>
                  <h4>Text Changes</h4>
                  <StringDiff method='diffSentences'
                              oldValue={previousText} 
                              newValue={currentText} />
                </>
              )
            }
          </div>
        )
      }
      else {
        return (
          <h4>Could not fetch changes.</h4>
        )
      }
  	}
	}
	
	return (
		<Modal onClose={() => setOpen(false)} onOpen={openModal} open={open} trigger={<Button size='small' className='latest-changes-button'>Latest Artifact Changes</Button>} size='large'>
      <Modal.Header>
        Latest Artifact Changes   
        <Popup trigger={<Icon name='question circle outline' className='latest-artifact-tooltip' />}
               content='Dates and version numbers refer to artifact import date and version from source repository into CEDAR'
               position='bottom center'
        />
      </Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <VersionDiff />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='grey' onClick={() => setOpen(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
	)
}

export default SearchResultHistory;