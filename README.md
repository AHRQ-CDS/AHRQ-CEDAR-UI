# CEDAR UI Demonstration

## Background
CEDAR UI is a client application that enables users to interact with the CEDAR Service. The CEDAR Service is a backend system that provides a machine-accessible API to CEDAR repository data. CEDAR's API is intended to allow a diverse set of existing or new systems to access the data that CEDAR aggregates from multiple source repositories. This approach allows CEDAR to support many different types of uses. For example, a clinician and a researcher may both find CEDAR valuable, but the way they would like to use CEDAR may be very different. This means that different user types could potentially benefit from having different user interfaces to interact with. 

In this vein, the CEDAR UI demonstration offers two different user experiences: (1) a SMART on FHIR application using the SMART on FHIR Sandbox environment and synthetic patient data; (2) a Standalone application, which offers a notional search interface.

## Prerequisites

* Node.js
* Yarn

## Installation and Setup for the Development Environment

This is a React app bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It requires node and yarn to be installed.

To install dependencies before running for the first time, run

```
yarn install
```

This application relies on the CEDAR API application, a Ruby and Sinatra app, for the CEDAR search API functionality. To run the CEDAR API locally on port 4567:

* Clone the CEDAR API repository. Follow the instructions on the CEDAR API README for any required dependencies specific to CEDAR API. 
```
git clone https://yourusername@bitbucket.org/ahrq/cedar_api.git
cd cedar_api
```
* Run the CEDAR API application
```
ruby cedar_api.rb
```

In the development environment, the CEDAR UI application may be run in two different contexts. The first context is as a SMART on FHIR application using the SMART on FHIR Sandbox environment and synthetic patient data. This simulates the experience of a clinician running the app from within an EHR. The second context is as a Standalone application, which offers a notional search interface. 

* To run CEDAR UI:

```
yarn start
```

* For the Standalone application, simply visit [http://localhost:3000/](http://localhost:3000/)
* For the SMART on FHIR development application, click [here](http://launch.smarthealthit.org/ehr.html?app=http%3A%2F%2Flocalhost%3A3000%2Flaunch%3Flaunch%3DeyJhIjoiMSIsImYiOiIxIn0%26iss%3Dhttp%253A%252F%252Flaunch.smarthealthit.org%252Fv%252Fr4%252Ffhir&user=). 


## Run the Test Suit

To run the test suite:


```
yarn test
```

## Build

```
yarn build
```

Builds the app for production to the `build` folder.
It bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
The app is ready to be deployed.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
