import React from 'react';
import  '../hamburger.scss';
import SunsetImageUpload from '../SunsetImageUpload';
import SunriseImageUpload from '../SunriseImageUpload';
import { Link } from "react-router-dom";
import '../UIDesigning.css';
import '../App.css';
import DownArrow from '../DownArrow';

export function renderSunriseLocationData({ location, sunTime, nightTime, scrollDiv, returnDiv }) {
	return (
		<div className = 'main-content-wrapper'>
			<div></div>
			<div id = 'main-div' className = 'sunrise-sunset-day-wrapper'>
				<div className = 'about-link-wrapper' >
					<Link className = 'link-wrapper' to="/about"> ABOUT </Link>
				</div>
				<div className = 'location-wrapper'>
					<div className = 'location-text-wrapper'>CURRENT TIME AT</div>
					<div className = 'location-day'> { location } </div>
				</div>
				<center>
					<div className = 'daytime-container'>
						<div className = 'daytime-image-wrapper'>
							<span> <SunriseImageUpload/> </span>	
							<span className = 'daytime-text-container'>Daytime</span>
						</div>
						<div className = 'time-container'>
								{ sunTime }
								<span className = 'time-text-wrapper'>
									<span className = 'pahar-text-wrapper'>PAHAR</span>
									<span className = 'garhi-text-wrapper'>GHARHI</span>
									<span className = 'pal-text-wrapper'>PAL</span>
									<span className = 'lamha-text-wrapper'>LAMHA</span>
								</span>
						</div>
					</div>
				</center>

				<center>
					<div className = 'daytime-sunset-container'>
						<div className = 'daytime-image-wrapper'>
							<span> <SunsetImageUpload/> </span>	
							<span className = 'daytime-sunset-text-container'>Time to sunset</span>
						</div>
						<div className = 'time-container'>
								{ nightTime }
								<span className = 'time-text-wrapper'>
									<span className = 'pahar-text-wrapper'>PAHAR</span>
									<span className = 'garhi-text-wrapper'>GHARHI</span>
									<span className = 'pal-text-wrapper'>PAL</span>
									<span className = 'lamha-text-wrapper'>LAMHA</span>
								</span>
						</div>
					</div>
				</center>
				<div className = 'read-more-wrapper' onClick = { scrollDiv }>
					<div className = 'link-wrapper'>READ MORE</div>
					<DownArrow />
				</div>
			</div>
			<div id = 'scrollUp' className = 'info-div-wrapper'> 
				<div className = 'pahar-heading'><b>PAHAR</b></div> A day and night consists of 4 pahars each. Day begins at sunrise and ends at sunset and Night is exactly opposite. Since length of day and night changes from season to season, pahars of the day and night are not of equal length of time.<br/><br/>

				<div className = 'garhi-heading'><b>GHARHI</b></div> Each pahar is divided into 8 equal parts called Gharhi.<br/><br/>

				<div className = 'pal-heading'><b>PAL</b></div> 60 pals make one gharhi.<br/><br/>

				<div className = 'lamha-heading'><b>LAMHA</b></div> Lamha and pal are considered interchangeable however in this app we have set 60 lamhas for each pal. Explanation on why this was done can be found in the about page.<br/><br/>

				The format of time in this app is displayed as:<br/><br/>

				Pahar | Gharhi | Pal | Lamha<br/><br/>
				1 | 5 | 27 | 52<br/><br/>

				This app was conceptualized by Kashif-ul-Huda (<a target='_blank' href='https://twitter.com/kaaashif'>@kaaashif</a>) and developed by QED42 Team (<a target='_blank' href='https://twitter.com/qed42'>@QED42</a>).
				<div id = 'go-up' className = 'go-up-wrapper' onClick = { returnDiv }>
					<span className = 'link-wrapper'>GO UP</span>
				</div>
			</div>
		</div>
	)
}