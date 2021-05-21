import _ from 'lodash';
import moment from 'moment';
import FHIR from 'fhirclient'

// Wrap our usage of fhirclient with some simple utilities

// TODO: Do we need this wrapping
// Wrap the oauth ready functionality, providing the SMART context, so we can wrap it in a promise
const smartReady = () => {
  return new Promise((resolve) => {
    FHIR.oauth2.ready((smart) => {
      resolve(smart)
    });
  });
}

// Some common functions for both basic FHIR and within a SMART context

// Given a SMART context and a search string (which can be blank), returns a promise
// that provides a list of patients loaded from the server
const loadPatients = (smart, searchQuery) => {
  const searchParams = { type: 'Patient' };
  if (searchQuery) {
    searchParams.query = searchQuery;
  }
  return smart.api.search(searchParams).then((response) => {
    if (response.data && response.data.entry) {
      return response.data.entry.map(entry => entry.resource);
    } else {
      return [];
    }
  });
}

const loadResources = (smart, patientId) => {
  const getResources = (type) => {
    // We need to wrap the results of smart.api.search with a real promise, using the jQuery
    // promise directly results in unexpected behavior
    return new Promise((resolve) => {
      smart.request(`${type}?patient=${patientId}`).then((response) => {
        // Different FHIR servers indicate the presence of results differently, try to be robust
        if ((_.isUndefined(response.total) && response.entry) ||
            (_.isNumber(response.total) && response.total > 0 && response.entry)) {
          const resources = response.entry.map((entry) => entry.resource);
          resolve(_.sortBy(resources, (resource) => moment(resource.startDate)).reverse());
        } else {
          resolve([]);
        }
      }, (error) => {
        resolve([]); // Eat errors for the moment
      });
    });
  };

  // TODO: Can we simplify this now that we just get conditions?
  return Promise.all([getResources('Condition')]);
}


const FHIRWrap = {

  // Given a FHIR server URL and a search string (which can be blank), returns a promise
  // that provides a list of patients loaded from the server
  loadPatients(fhirServer, searchQuery) {
    const smart = FHIR.client({ serverUrl: fhirServer });
    return loadPatients(smart, searchQuery);
  },

  // Given a FHIR server URL and a patient, returns a promise that provides the patient's
  // conditions loaded from the server
  loadResources(fhirServer, patientId) {
    const smart = FHIR.client({ serverUrl: fhirServer });
    return loadResources(smart, patientId);
  }
}

const SMART = {

  // Wrap the oauth ready functionality
  ready() {
    return smartReady();
  },

  // Wrap the oauth authorize functionality too
  authorize(settings) {
    FHIR.oauth2.authorize(settings);
  },

  // Given a search string (which can be blank), returns a promise
  // that provides a list of patients loaded from the server
  loadPatients(searchQuery) {
    return smartReady().then((smart) => {
      return loadPatients(smart, searchQuery)
    });
  },

  // Given a patient, returns a promise that provides the patient's conditions,
  // medications, procedures, and observations loaded from the server
  loadResources(patientId) {
    return smartReady().then((smart) => {
      return loadResources(smart, patientId)
    });
  },

  // Return a promise that, if the app is loaded in a SMART context, provides the loaded
  // user, patient, and conditions
  load() {
    return smartReady().then((smart) => {
      const user = smart.user.read();
      const patient = smart.patient.read();
      const resources = FHIRWrap.loadResources(smart.state.serverUrl, smart.patient.id);
      return Promise.all([user, patient, resources]).then(([user, patient, resources]) => {
        return [user, patient].concat(resources);
      });
    });
  }
}

export { SMART, FHIRWrap };
