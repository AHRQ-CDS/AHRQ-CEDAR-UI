import React from 'react';

import '../assets/css/Ahrq.css'

import LinkWrapper from './LinkWrapper';
import logo_ahrq from '../assets/img/logo-ahrq.png';
import us_flag_small from '../assets/img/us_flag_small.png';
import logo_HHSmini from '../assets/img/logo-HHSmini.png';
import envelope_regular from '../assets/img/envelope-regular.png';

export default function AhrqHeader({headerText}) {
	return (
		<>
		<div id="top-bar" role="navigation" aria-label="Agency for Healthcare Research and Quality Header" className='no-print'>
      <div className="topbar">
        <div className="ahrq">
          <div className="usa-banner usa-banner-bg">
					  <div className="usa-accordion usa-accordion-text-color">
					    <header className="usa-banner__header">
					      <div className="row no-gutters row-mobile-offset row-tweak">
					        <div className="col-xs-auto col-md-auto col-md-offset-0p5 img-icon">
					          <img className="usa-banner__header-flag usa-banner-flag-tweak" src={us_flag_small} alt="U.S. flag" />
					        </div>
					        <div className="col-sm-auto col-lg-auto banner-hhs img-icon">
					          <img className="usa-banner__header-flag usa-banner-logo-tweak" src={logo_HHSmini} alt="Health and Human Services Logo" />
					        </div>
					        <div className="col-xs-8 col-md-8 txt-gov-banner div-col-tweak">
					          <p className="usa-banner__header-text">
					            <LinkWrapper href="https://www.hhs.gov/">An official website of the Department of Health &amp; Human Services</LinkWrapper>
					          </p>
					        </div>
					      </div>
					    </header>
					  </div>
					</div>
          <div role="main" className="container-fluid js-quickedit-main-content">
            <div className="row row-tweak">
              <header id="primary-header" className="header row-side-margins mobile-row-side-margins" role="heading" aria-level="1">
							  <div className="col-md-12">
							    <div className="primary-header-wrapper">
							      <div className="row row-tweak">
							        <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 div-col-tweak">
							          <div className="logo-ahrq">
							            <LinkWrapper href="https://www.ahrq.gov"><img src={logo_ahrq} alt="AHRQ: Agency for Healthcare Research and Quality" /></LinkWrapper>
							          </div>
							        </div>
							        <div className="d-xs-none d-sm-none d-md-none d-lg-block col-lg-9 d-xl-block col-xl-9">
							          <div id="utility-nav">
							            <ul className="clearfix">
							              <li className="first">
							                <LinkWrapper href="https://search.ahrq.gov/" target="_blank" rel="noreferrer">Search All AHRQ Sites</LinkWrapper>
							              </li>
							              <li>
							                <LinkWrapper href="https://www.ahrq.gov/cpi/about/careers/index.html" target="_blank" rel="noreferrer">Careers</LinkWrapper>
							              </li>
							              <li>
							                <LinkWrapper href="https://www.ahrq.gov/contact/index.html" target="_blank" rel="noreferrer">Contact Us</LinkWrapper>
							              </li>
							              <li>
							                <LinkWrapper href="https://www.ahrq.gov/topics/informacion-en-espanol/index.html" target="_blank" rel="noreferrer">Español</LinkWrapper>
							              </li>
							              <li className="last">
							                <LinkWrapper href="https://info.ahrq.gov/" target="_blank" rel="noreferrer">FAQs</LinkWrapper>
							              </li>
							              <li>
							                <LinkWrapper href="https://subscriptions.ahrq.gov/accounts/USAHRQ/subscriber/new" target="_blank" rel="noreferrer"><img src={envelope_regular} width="18" height="18" className="utility-envelope" alt="" />
							                  Email Updates
							                </LinkWrapper>
							              </li>
							            </ul>
							          </div>
							        </div>
							      </div>
							    </div>
							  </div>
							</header>
            </div>
          </div>
        </div>
      </div>
    </div>
		<section className='no-print'>
		  <div id="header" role="navigation" aria-label="Clinical Decision Support Header">
		    <header className="header" aria-label="A H R Q Banner">
		      <div className="header__banner row">
		        <LinkWrapper href="../" className="btn btn-link nav-button" title="CEDAR Home">
              <span className="glyphicon glyphicon-link"></span> CEDAR Home
		        </LinkWrapper>
		        <div className="header__banner-text">
		          <LinkWrapper href="../">
		            <div className="header__banner-text-top">
		              Patient-Centered Outcomes Research
		            </div>
		            <div className="header__banner-text-middle">
		              {headerText}
		            </div>
		            <div className="header__banner-text-bottom">
		              Accelerating Evidence into Practice through CDS
		            </div>
		          </LinkWrapper>
		        </div>
		      </div>
		    </header>
		  </div>
		</section>
	</>
	)
}