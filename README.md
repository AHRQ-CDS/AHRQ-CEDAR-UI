# The CEDAR Project

The [CEDAR project](https://cds.ahrq.gov/cedar/) provides a standards-based API that supports search, access, and use of patient centered outcomes research and other research findings across multiple repositories and programs within [AHRQ's Center for Evidence and Practice Improvement (CEPI)](https://www.ahrq.gov/cpi/centers/cepi/index.html).

Health IT developers can use CEDAR to integrate AHRQ CEPI research findings directly into their existing systems, where the findings can then be accessed and used by researchers, clinicians, policymakers, patients, and others. CEDAR optimizes the use of patient centered outcomes research and other research data by following standard guidelines for improving the Findability, Accessibility, Interoperability, and Reuse (the FAIR principles) of digital assets, providing fast and efficient access to information.

CEDAR is publicly available for other platforms to use to discover and retrieve AHRQ evidence from multiple resources simultaneously.

## CEDAR UI Demonstration

### Background

CEDAR UI is a client application that enables users to interact with the CEDAR Service. The CEDAR Service is a backend system that provides a machine-accessible API to CEDAR repository data. Decoupling the CEDAR UI from repository data access methods means that different user types could potentially benefit from having different user interfaces to interact with.

In this vein, the CEDAR UI demonstration offers two different user experiences: (1) a SMART on FHIR application using the SMART on FHIR Sandbox environment and synthetic patient data; (2) a Standalone application, which offers a notional search interface.

See also:

- [Contribution Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE-OF-CONDUCT.md)
- [Terms and Conditions](TERMS-AND-CONDITIONS.md)

### Prerequisites

* Node.js
* Yarn

### Installation and Setup for the Development Environment

This is a React app bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It requires node and yarn to be installed.

To install dependencies before running for the first time, run

```
yarn install
```

This application relies on the CEDAR API application, a Ruby and Sinatra app, for the CEDAR search API functionality. To run the CEDAR API locally on port 4567:

Clone the CEDAR API repository. Follow the instructions on the CEDAR API README for any required dependencies specific to CEDAR API.
```
git clone https://yourusername@bitbucket.org/ahrq/cedar_api.git
cd cedar_api
```
Run the CEDAR API application
```
ruby cedar_api.rb
```

In the development environment, the CEDAR UI application may be run in two different contexts. The first context is as a SMART on FHIR application using the SMART on FHIR Sandbox environment and synthetic patient data. This simulates the experience of a clinician running the app from within an EHR. The second context is as a Standalone application, which offers a notional search interface.

To run CEDAR UI:

```
yarn start
```

For the Standalone application, simply visit [http://localhost:3000/](http://localhost:3000/)

For the SMART on FHIR development application, click [here](http://launch.smarthealthit.org/ehr.html?app=http%3A%2F%2Flocalhost%3A3000%2Flaunch%3Flaunch%3DeyJhIjoiMSIsImYiOiIxIn0%26iss%3Dhttp%253A%252F%252Flaunch.smarthealthit.org%252Fv%252Fr4%252Ffhir&user=).

### Running the Test Suit

To run the test suite:

```
yarn test
```

### Building

```
yarn build
```

Builds the app for production to the `build` folder.
It bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
The app is ready to be deployed.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## LICENSE

Copyright 2022 Agency for Healthcare Research and Quality.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this software except
in compliance with the License. You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is
distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied.  See the License for the specific language governing permissions and limitations under the
License.
