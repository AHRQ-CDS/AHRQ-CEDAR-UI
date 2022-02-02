import React, { useState }  from 'react';
import { Button, Divider, Form, Icon, Loader, Modal, Popup  } from 'semantic-ui-react';
import SearchResultHistory from './SearchResultHistory';
import './SearchResultHistory.css'

function SearchResultHistoryModal({ resource }) {
  const [open, setOpen] = useState(false);
  // On first load: right resource is "current" and is the resource passed in from the search results
  const [rightVersion, setRightVersion] = useState(resource.meta.versionId);
  // On first load: left version is "previous"
  const [leftVersion, setLeftVersion] = useState(resource.meta.versionId - 1); 
  // On first load: right/current version has been passed in from the search results
  const [rightResource, setRightResource] = useState({ status: 'complete', data: resource });
  // On first load: left/previous version hasn't been retrieved yet
  const [leftResource, setLeftResource] = useState({status: 'none'});
	
  const openModal = () => {
    setOpen(true);
    setLeftResource({ status: 'pending' });
    getResourceByVersion(leftVersion).then((data) => setLeftResource({ status: 'complete', data: data}));
  }

  // On close: return the right and left resource and versions to their original states
  const closeModal = () => {
    setRightVersion(resource.meta.versionId);
    setLeftVersion(resource.meta.versionId - 1);
    setRightResource({ status: 'complete', data: resource });
    setLeftResource({status: 'none'});
    setOpen(false);
  }

  async function getResourceByVersion(versionId) {
    const response = await fetch(`/api/fhir/Citation/${resource.id}/_history/${versionId}`);
    return await response.json();
  }

  const VersionControl = () => {
    const dropdownOptionsFromArray = () => {
      const optionsVersionId = Array.from({length: resource.meta.versionId}, (_, i) => i + 1);
      let options = []
      for(const value of optionsVersionId) {
          options.push({
            key: value,
            text: `Version ${value}`,
            value:value,
          })
      }
      return options
    }

    const handleResourceVersionChange = (event, data) => {
      if (data.name === "left-version") {
        setLeftVersion(data.value);
        setLeftResource({ status: 'pending' });
        getResourceByVersion(data.value).then((resourceVersion) => setLeftResource({ status: 'complete', data: resourceVersion}));
      }
      else {
        setRightVersion(data.value);
        setRightResource({ status: 'pending' });
        getResourceByVersion(data.value).then((resourceVersion) => setRightResource({ status: 'complete', data: resourceVersion}));
      }
    }

    const VersionImportDate = (props) => {
      if (props.resource.data && props.resource.data.date) {
        return (
          <span>Imported on: <em>{props.resource.data.date}</em></span>
        )
      }
      else {
        return null;
      }
    }

    if(resource.meta.versionId < 3) {
      return (
        <>
          <div className="version-control artifact-changes-left-control">
            Version {leftVersion}, <VersionImportDate resource={leftResource} />
          </div>
          <div className="version-control artifact-changes-right-control">
            Version {rightVersion}, <VersionImportDate resource={rightResource} />
          </div>
        </>

      )
    }
    else {
      return (
        <>
          <div className="version-control artifact-changes-left-control">
            <Form.Select selection 
                         name="left-version" 
                         options={dropdownOptionsFromArray()} 
                         onChange={handleResourceVersionChange} 
                         value={leftVersion}
                         className="version-select" />
            <VersionImportDate resource={leftResource} />
          </div>
          <div className="version-control artifact-changes-right-control">
            <Form.Select selection 
                         name="right-version" 
                         options={dropdownOptionsFromArray()} 
                         onChange={handleResourceVersionChange} 
                         value={rightVersion} 
                         className="version-select" />
            <VersionImportDate resource={rightResource} />
          </div>
        </>
      )
    }
  }

  const VersionBody = () => {
    if ((leftResource.status === 'complete' && leftResource.data) && (rightResource.status === 'complete' && rightResource.data)) {
      return (<SearchResultHistory leftResource={leftResource} rightResource={rightResource} />)
    }
    else if (leftResource.status === 'pending' || rightResource.status === 'pending') {
      return (<div><Loader active content='Loading' /></div>)
    }
    else {
      return (<h4>Could not load versions for this artifact.</h4>)
    }
  }
	
	return (
		<Modal onClose={closeModal} onOpen={openModal} open={open} trigger={<Button size='small' className='artifact-changes-button'>Artifact Changes</Button>} size='large'>
      <Modal.Header>
        Artifact Changes   
        <Popup trigger={<Icon name='question circle outline' className='artifact-changes-tooltip' />}
               content='Dates and version numbers refer to artifact import date and version from source repository into CEDAR'
               position='bottom center'
        />
        <div className="artifact-changes-legend">
          <Icon name='square' size='small' className="artifact-changes-additions"/> Additions
          <Icon name='square' size='small' className="artifact-changes-deletions"/> Deletions
        </div>
      </Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <VersionControl />
          <Divider />
          <VersionBody />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions><Button color='grey' onClick={closeModal}>Close</Button></Modal.Actions>
    </Modal>
	);
}

export default SearchResultHistoryModal;