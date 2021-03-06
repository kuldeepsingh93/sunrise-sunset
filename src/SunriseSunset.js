import React from 'react';
import axios from 'axios';	
import  './hamburger.scss';
import PaharLoading from './PaharLoading';
import './UIDesigning.css';
import './App.css';
import { renderSunriseLocationData } from './RenderData/renderSunriseLocationData';
import { renderSunriseData } from './RenderData/renderSunriseData';
import { renderSunsetLocationData } from './RenderData/renderSunsetLocationData';
import { renderSunsetData } from './RenderData/renderSunsetData';

class SunriseSunset extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = { weatherData: [], time: null, errorMsg: '' };
		this.startTime = this.startTime.bind(this);
		this.convertToPaharDay = this.convertToPaharDay.bind(this);
		this.convertToPaharNight = this.convertToPaharNight.bind(this);
		this.sunriseSunsetInPaharDay = this.sunriseSunsetInPaharDay.bind(this);
		this.convertTimeStamp = this.convertTimeStamp.bind(this);
		this.scrollInfoDiv = this.scrollInfoDiv.bind(this);
		this.returningMainDiv = this.returningMainDiv.bind(this);
	}
	componentDidMount()
	{
		let weatherData = this.state.weatherData;
		if (navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition((position) => {
				let latitude = position.coords.latitude;
				let longitude = position.coords.longitude;
				axios.get(`https://api.apixu.com/v1/forecast.json?key=4b4142a4fe3a4a3b81d104736191007&q=${latitude},${longitude}&days=3`)
				.then((response) => {

					window.OneSignal.getUserId(function(userId) {
						if (userId) {
							const body = { "lat": latitude, "lng": longitude, "userId": userId, notifications:[{ value: 20 }]}
							if(process.env.NODE_ENV === 'development')
							{
								axios.post('http://localhost:8001/api/notification-token', body)
								.then((response) => {
									console.log(response)
								})
								.catch((error) => console.log(error));
								console.log('local dev server')
							}
							else if(process.env.NODE_ENV === 'production')
							{
								axios.post('https://www.pahar.tk/api/notification-token', body)
								.then((response) => {
									console.log(response)
								})
								.catch((error) => console.log(error));
								console.log('prod server');
							}
						}
		      });
					console.log(response.data)
					let placeName = response.data.location.name;
					const sunriseTime = response.data.forecast.forecastday[0].astro.sunrise;
					const sunsetTime = response.data.forecast.forecastday[0].astro.sunset;
					const todayDate = response.data.forecast.forecastday[0].date;
					const tomorrowDate = response.data.forecast.forecastday[1].date;
					const tomorrowSunriseTime = response.data.forecast.forecastday[1].astro.sunrise;
					const tomorrowSunsetTime = response.data.forecast.forecastday[1].astro.sunset;
					weatherData[0] = { latitude: latitude, longitude: longitude, currentTimeStamp: (new Date()).getTime(), tomorrowDate: tomorrowDate, sunrise: sunriseTime, todayDate: todayDate, place: placeName, sunset: sunsetTime, tomorrowSunriseTime: tomorrowSunriseTime, tomorrowSunsetTime: tomorrowSunsetTime };
					this.setState({ weatherData: weatherData },() => {
						this.convertTimeStamp();
						this.sunriseSunsetInPaharDay(); });
				})
				.catch((error) => {
					console.log(error)
				});
			})
		}
		else
		{
			this.setState({ errorMsg: 'Please Allow Location to Serve you Better! Thank you.' });
		}

		navigator.geolocation.watchPosition(() => {}, (error) => {
			if (error.code === error.PERMISSION_DENIED){
				this.setState({ errorMsg: 'Please Allow Location to Serve you Better! Thank you.' });
			}
		});

		this.startTime();
	}
	scrollInfoDiv()
	{
		let container = document.getElementById('scrollUp');
		container.scrollIntoView({block: 'start', behaviour: 'smooth'});
	}
	returningMainDiv()
	{
		let container = document.getElementById('main-div');
		container.scrollIntoView({block: 'start', behaviour: 'smooth'});
	}
	convertTimeStamp()
	{
		// -------------------converting today's sunrise time to timestamp--------------------------

		let myweather = this.state.weatherData;
		const { weatherData } = this.state;
		let time1 = weatherData[0].sunrise;
		let startDate = new Date();
		startDate.setHours(time1.split(":")[0]);
		startDate.setMinutes(time1.split(" ")[0].split(':')[1]);
		startDate.setSeconds(0);
		let startStamp = startDate.getTime();

		// --------------------converting today's sunset time to timestamp----------------------------

		let time2 = weatherData[0].sunset;
		let hr = parseInt(time2.split(':')[0]) + 12;
		let endDate = new Date();
		endDate.setHours(hr);
		endDate.setMinutes(time2.split(' ')[0].split(':')[1]);
		endDate.setSeconds(0);
		let endStamp = endDate.getTime();

		// -----------------------------getting timestamp of previous date-----------------------------

		let prevDate = new Date();
		let getPrevDate = this.state.weatherData[0].todayDate;
		prevDate.setDate(getPrevDate.split('-')[2] - 1);
		prevDate.setHours(12);
		let prevDateStamp = prevDate.getTime();

		// --------------------converting tomorrow sunrise time to timestamp-------------------------

		let tomorrowtime1 = weatherData[0].tomorrowSunriseTime;
		let tomorrowDate = weatherData[0].tomorrowDate;
		let tstartDate = new Date();
		tstartDate.setHours(tomorrowtime1.split(":")[0]);
		tstartDate.setMinutes(tomorrowtime1.split(" ")[0].split(':')[1]);
		tstartDate.setDate(tomorrowDate.split('-')[2]);
		tstartDate.setMonth(tomorrowDate.split('-')[1] - 1);
		tstartDate.setSeconds(0);
		let tstartStamp = tstartDate.getTime();

		// --------------------converting tomorrow sunset time to timestamp---------------------------

		let tomorrowtime2 = weatherData[0].tomorrowSunsetTime;
		let changeFormat = parseInt(tomorrowtime2.split(':')[0]) + 12;
		let tendDate = new Date();
		tendDate.setHours(changeFormat);
		tendDate.setMinutes(tomorrowtime2.split(' ')[0].split(':')[1]);
		tendDate.setDate(tomorrowDate.split('-')[2]);
		tendDate.setMonth(tomorrowDate.split('-')[1] - 1);
		tendDate.setSeconds(0);
		let tendStamp = tendDate.getTime();

		// ---------------------getting today's midnight timestamp-----------------------------

		let todayMidNight = new Date();
		todayMidNight.setHours(0,0,0,0);
		let todayMidNightStamp = todayMidNight.getTime();

		// -----------------------getting tomorrow's midnight timestamp----------------------------

		let tomorrowMidNight = new Date();
		tomorrowMidNight.setHours(24,0,0,0);
		let tomorrowMidNightStamp = tomorrowMidNight.getTime();

		// ----------------11:59 pm timestamp for sending API request ---------------------------

		let elevenFiftyNine = new Date();
		elevenFiftyNine.setHours(23);
		elevenFiftyNine.setMinutes(59);
		elevenFiftyNine.setSeconds(0);
		let elevenFiftyNineStamp = elevenFiftyNine.getTime();

		myweather[1] = { elevenFiftyNineStamp: elevenFiftyNineStamp, prevDateStamp: prevDateStamp, startStamp: startStamp, endStamp: endStamp, tstartStamp: tstartStamp, tendStamp: tendStamp, tomorrowMidNightStamp: tomorrowMidNightStamp, todayMidNightStamp: todayMidNightStamp };
		myweather[0].currentTimeStamp = (new Date()).getTime();
		this.setState({ weatherData: myweather });
	}
	// -----------------calculating pahar, garhi, pal, lamha and getting time for day time---------------------------------

	convertToPaharDay(timePahar)
	{
		let timeDiff = (this.state.weatherData[1].endStamp - this.state.weatherData[1].startStamp) / 1000;

		let onePahar = timeDiff / 4 / 60;
		let oneGarhi = onePahar / 8;
		let onePal = oneGarhi / 60;
		let oneLamha = onePal / 60;
		let convertToPahar = Math.floor(( timePahar / 60 ) / onePahar);
		let convertToGarhi = Math.floor((( timePahar / 60 ) % onePahar ) / oneGarhi);
		let convertToPal = Math.floor(((( timePahar / 60 ) % onePahar ) % oneGarhi ) / onePal);
		let convertToLamha = Math.round((((( timePahar / 60 ) % onePahar ) % oneGarhi ) % onePal) / oneLamha);
		//let paharTime = `\u00A0\u00A0\u00A0${convertToPahar} \u00A0\u00A0\u00A0 | \u00A0\u00A0\u00A0\u00A0 ${convertToGarhi} \u00A0\u00A0\u00A0 | \u00A0  ${convertToPal} | \u00A0\u00A0\u00A0  ${convertToLamha}`;
		return (
			<span className = 'time-values-wrapper'>
				<span className='pahar-time-wrapper'>{`${convertToPahar}`}</span>
				<span className='garhi-time-wrapper'>{ `${convertToGarhi}`}</span>
				<span className='pal-time-wrapper'>{ `${convertToPal}`}</span>
				<span className='lamha-time-wrapper'>{`${convertToLamha}`}</span>
			</span>
		);
	}

	// ------------------------calculating pahar, garhi, pal, lamha and getting time for night time--------------------------

	convertToPaharNight(timePahar)
	{
		const { weatherData } = this.state;
		if ( (weatherData[0].currentTimeStamp > weatherData[1].endStamp) && (weatherData[0].currentTimeStamp < weatherData[1].tomorrowMidNightStamp))
		{
			let timeDiff = (this.state.weatherData[1].tstartStamp - this.state.weatherData[1].endStamp) / 1000;
			let onePahar = timeDiff / 4 / 60;
			let oneGarhi = onePahar/ 8;
			let onePal = oneGarhi / 60;
			let oneLamha = onePal / 60;
			let convertToPahar = Math.floor(( timePahar / 60 ) / onePahar);
			let convertToGarhi = Math.floor((( timePahar / 60 ) % onePahar ) / oneGarhi);
			let convertToPal = Math.floor(((( timePahar / 60 ) % onePahar ) % oneGarhi ) / onePal);
			let convertToLamha = Math.round((((( timePahar / 60 ) % onePahar ) % oneGarhi ) % onePal) / oneLamha);
			//let paharTime = `\u00A0\u00A0\u00A0${convertToPahar} \u00A0\u00A0\u00A0 | \u00A0\u00A0\u00A0\u00A0 ${convertToGarhi} \u00A0\u00A0\u00A0 | \u00A0  ${convertToPal} | \u00A0\u00A0\u00A0  ${convertToLamha}`;
			return (
				<span className='time-values-wrapper'>
					<span className='pahar-time-wrapper'>{`${convertToPahar}`}</span>
					<span className='garhi-time-wrapper'>{ `${convertToGarhi}`}</span>
					<span className='pal-time-wrapper'>{ `${convertToPal}`}</span>
					<span className='lamha-time-wrapper'>{`${convertToLamha}`} </span>
				</span>
			);
		}
		else if ( (weatherData[0].currentTimeStamp > weatherData[1].todayMidNightStamp) && (weatherData[0].currentTimeStamp < weatherData[1].startStamp))
		{
			let timeDiff = (this.state.weatherData[1].startStamp - this.state.weatherData[4].prevStamp) / 1000;
			let onePahar = timeDiff / 4 / 60;
			let oneGarhi = onePahar / 8;
			let onePal = oneGarhi / 60;
			let oneLamha = onePal / 60;
			let convertToPahar = Math.floor(( timePahar / 60 ) / onePahar);
			let convertToGarhi = Math.floor((( timePahar / 60 ) % onePahar ) / oneGarhi);
			let convertToPal = Math.floor(((( timePahar / 60 ) % onePahar ) % oneGarhi ) / onePal);
			let convertToLamha = Math.round((((( timePahar / 60 ) % onePahar ) % oneGarhi ) % onePal) / oneLamha);
			//let paharTime = `\u00A0\u00A0\u00A0${convertToPahar} \u00A0\u00A0\u00A0 | \u00A0\u00A0\u00A0\u00A0 ${convertToGarhi} \u00A0\u00A0\u00A0 | \u00A0  ${convertToPal} | \u00A0\u00A0\u00A0  ${convertToLamha}`;
			return (
				<span className='time-values-wrapper'>
					<span className='pahar-time-wrapper'>{`${convertToPahar}`}</span>
					<span className='garhi-time-wrapper'>{ `${convertToGarhi}`}</span>
					<span className='pal-time-wrapper'>{ `${convertToPal}`}</span>
					<span className='lamha-time-wrapper'>{`${convertToLamha}`} </span>
				</span>
			);
		}
	}
	sunriseSunsetInPaharDay()
	{
		let weatherData = this.state.weatherData;
		
		// -------------------------------sending API request at 11:59 pm-----------------------------------------

		if ( weatherData[0].currentTimeStamp === weatherData[1].elevenFiftyNineStamp)
		{
			const latitude = weatherData[0].latitude;
			const longitude = weatherData[0].longitude;
			axios.get(`https://api.apixu.com/v1/forecast.json?key=4b4142a4fe3a4a3b81d104736191007&q=${latitude},${longitude}&days=2`)
			.then((response) => {
				console.log(response.data)
				const placeName = response.data.location.name;
				const sunriseTime = response.data.forecast.forecastday[0].astro.sunrise;
				const sunsetTime = response.data.forecast.forecastday[0].astro.sunset;
				const todayDate = response.data.forecast.forecastday[0].date;
				const tomorrowDate = response.data.forecast.forecastday[1].date;
				const tomorrowSunriseTime = response.data.forecast.forecastday[1].astro.sunrise;
				const tomorrowSunsetTime = response.data.forecast.forecastday[1].astro.sunset;
				weatherData[0] = { latitude: latitude, longitude: longitude, currentTimeStamp: (new Date()).getTime(), tomorrowDate: tomorrowDate, sunrise: sunriseTime, todayDate: todayDate, place: placeName, sunset: sunsetTime, tomorrowSunriseTime: tomorrowSunriseTime, tomorrowSunsetTime: tomorrowSunsetTime };
				this.setState({ weatherData: weatherData })
			})
			.catch((error) => error);
		}

		//-----------sending sunrise-sunset time difference to be converted in pahar time for day time----------------

		if ( (weatherData[0].currentTimeStamp > weatherData[1].startStamp) && (weatherData[0].currentTimeStamp < weatherData[1].endStamp) )
		{
			let sunrisePaharDiff = ( weatherData[0].currentTimeStamp - weatherData[1].startStamp ) / 1000;
			let sunsetPaharDiff = ( weatherData[1].endStamp - weatherData[0].currentTimeStamp ) / 1000;
			let nextSunrisePaharDiff = ( weatherData[1].tstartStamp - weatherData[0].currentTimeStamp ) / 1000;
			let sunrisePahar = this.convertToPaharDay(sunrisePaharDiff);
			let sunsetPahar = this.convertToPaharDay(sunsetPaharDiff);
			let nextSunrisePahar = this.convertToPaharDay(nextSunrisePaharDiff);
			if ( weatherData[2] ) {
				weatherData[2] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunrisePahar: nextSunrisePahar };
				this.setState({ weatherData: weatherData });
			} else {
				weatherData[2] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunrisePahar: nextSunrisePahar };
				this.setState({ weatherData: weatherData });
			}
		}

		//-----------sending sunset-midnight time difference to be converted in pahar time for night time----------------

		else if ( (weatherData[0].currentTimeStamp > weatherData[1].endStamp) && (weatherData[0].currentTimeStamp < weatherData[1].tomorrowMidNightStamp) )
		{
			let weatherData = this.state.weatherData;
			let sunsetPaharDiff = ( weatherData[0].currentTimeStamp - weatherData[1].endStamp ) / 1000;
			let sunrisePaharDiff = ( weatherData[1].tstartStamp - weatherData[0].currentTimeStamp ) / 1000;
			let nextSunsetPaharDiff = ( weatherData[1].tendStamp - weatherData[0].currentTimeStamp ) / 1000;
			let sunsetPahar = this.convertToPaharNight(sunsetPaharDiff);
			let sunrisePahar = this.convertToPaharNight(sunrisePaharDiff);
			let nextSunsetPahar = this.convertToPaharNight(nextSunsetPaharDiff);
			if ( weatherData[3] ) {
				weatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
				this.setState({ weatherData: weatherData });
			} else {
				weatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
				this.setState({ weatherData: weatherData });
			}
		}

		//-----------sending midnight-sunrise time difference to be converted in pahar time for night time----------------

		else if ( (weatherData[0].currentTimeStamp > weatherData[1].todayMidNightStamp) && (weatherData[0].currentTimeStamp < weatherData[1].startStamp) )
		{
			let weatherData = this.state.weatherData;
			let unixdt = weatherData[1].prevDateStamp / 1000;
			let latitude = weatherData[0].latitude;
			let longitude = weatherData[0].longitude;
			if (!weatherData[4]) {
				axios.get(`https://api.apixu.com/v1/history.json?key=4b4142a4fe3a4a3b81d104736191007&q=${latitude},${longitude}&unixdt=${unixdt}`)
				.then((response) => {
					console.log(response.data)
					let prevSunset = response.data.forecast.forecastday[0].astro.sunset;
					let preDate = response.data.forecast.forecastday[0].date;
					let hr = parseInt(prevSunset.split(':')[0]) + 12;
					let prevDate = new Date();
					prevDate.setDate(preDate.split('-')[2]);
					prevDate.setHours(hr);
					prevDate.setMinutes(prevSunset.split(' ')[0].split(':')[1]);
					prevDate.setSeconds(0);
					console.log(prevDate)
					let prevStamp = prevDate.getTime();
					weatherData[4] = { prevStamp: prevStamp };
					this.setState({ weatherData: weatherData },() => {
						let sunsetPaharDiff = ( weatherData[0].currentTimeStamp - weatherData[4].prevStamp ) / 1000;
						let sunrisePaharDiff = ( weatherData[1].startStamp - weatherData[0].currentTimeStamp ) / 1000;
						let nextSunsetPaharDiff = ( weatherData[1].endStamp - weatherData[0].currentTimeStamp ) / 1000;
						let sunsetPahar = this.convertToPaharNight(sunsetPaharDiff);
						let sunrisePahar = this.convertToPaharNight(sunrisePaharDiff);
						let nextSunsetPahar = this.convertToPaharNight(nextSunsetPaharDiff);
						if ( weatherData[3] ) {
							weatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
							this.setState({ weatherData: weatherData });
						} else {
							weatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
							this.setState({ weatherData: weatherData });
						}
					});
				})
				.catch((error) => error);
			}
			else if (weatherData[4])
			{
				let sunsetPaharDiff = ( weatherData[0].currentTimeStamp - weatherData[4].prevStamp ) / 1000;
				let sunrisePaharDiff = ( weatherData[1].startStamp - weatherData[0].currentTimeStamp ) / 1000;
				let nextSunsetPaharDiff = ( weatherData[1].endStamp - weatherData[0].currentTimeStamp ) / 1000;
				let sunsetPahar = this.convertToPaharNight(sunsetPaharDiff);
				let sunrisePahar = this.convertToPaharNight(sunrisePaharDiff);
				let nextSunsetPahar = this.convertToPaharNight(nextSunsetPaharDiff);
				if ( weatherData[3] ) {
					weatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
					this.setState({ weatherData: weatherData });
				} else {
					weatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
					this.setState({ weatherData: weatherData });
				}
			}
		}
	}
	startTime() 
	{
	  let currentTime = new Date();
	  let h = (currentTime.getHours() < 10 ? '0' : '') + currentTime.getHours();
	  let m = (currentTime.getMinutes() < 10 ? '0' : '') + currentTime.getMinutes();
	  let s = (currentTime.getSeconds() < 10 ? '0' : '') + currentTime.getSeconds();
	  let ms = (currentTime.getMilliseconds() < 10 ? '0' : '') + currentTime.getMilliseconds();
		let realTime = h + ":" + m + ":" + s + ':' + ms;
	  this.timer = setTimeout(this.startTime, 300);
	  this.stateTimer = setTimeout(this.setState({ time: realTime }), 400);
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.time !== this.state.time) {
			try {
				const currentTimeStamp = (new Date()).getTime();
				const currentWeatherData = Object.assign({}, this.state.weatherData);
				currentWeatherData[0].currentTimeStamp = currentTimeStamp;
				this.setState({
					weatherData: currentWeatherData,
				})
				this.sunriseSunsetInPaharDay();
			} catch (e) {}
		}
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
		this.stateTimer && clearTimeout(this.stateTimer);
	}

	render()
	{
		const { weatherData } = this.state;
		if ( weatherData[0] && weatherData[1] )
		{
			//-----------------------------code for day time-------------------------------------

			if ( weatherData[2] && (weatherData[0].currentTimeStamp >= weatherData[1].startStamp && weatherData[0].currentTimeStamp < weatherData[1].endStamp))
			{
				let location = weatherData[0].place;
				let sunTime = weatherData[2].sunrisePahar;
				let nightTime = weatherData[2].sunsetPahar;
				let scrollDiv = this.scrollInfoDiv;
				let returnDiv = this.returningMainDiv;

				if(location)
				{
					return renderSunriseLocationData({ location, sunTime, nightTime, scrollDiv, returnDiv });
				}
				else {
					return renderSunriseData({ sunTime, nightTime, scrollDiv, returnDiv });
				}
			}
			else if ( weatherData[3]
				&& (((weatherData[0].currentTimeStamp >= weatherData[1].endStamp) && (weatherData[0].currentTimeStamp < weatherData[1].tomorrowMidNightStamp))
				|| ((weatherData[0].currentTimeStamp >= weatherData[1].todayMidNightStamp) && (weatherData[0].currentTimeStamp < weatherData[1].startStamp))) )
			{
				let location = weatherData[0].place;
				let sunTime = weatherData[3].sunrisePahar;
				let nightTime = weatherData[3].sunsetPahar;
				let scrollDiv = this.scrollInfoDiv;
				let returnDiv = this.returningMainDiv;

				if ( location ) {
					return renderSunsetLocationData({ location, sunTime, nightTime, scrollDiv, returnDiv });
				}
				else {
					return renderSunsetData({ sunTime, nightTime, scrollDiv, returnDiv });
				}
			}		
			else 
			{
				return <center className = 'center'> <PaharLoading /> </center>;
			}
		}
		else if (this.state.errorMsg) {
			return (
				<center className = 'center'>
					<span>
						{this.state.errorMsg}
					</span>
				</center>
			);
		}
		else
		{
			return <center className = 'center'> <PaharLoading /> </center>;	
		}
	}
}
export default SunriseSunset;