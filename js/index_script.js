$(document).ready(function() {
	displayDate();
	displayTime();
});

const currentDateHTML = $(".current-date");
const currentTimeHTML = $(".current-time");

function displayDate() {
	let currentDate = new Date();
	let dateString = currentDate.toDateString();
	currentDateHTML.text(dateString);
}

function getTimeString({
	hours,
	minutes,
	seconds,
	zone
}) {
	if (minutes / 10 < 1) {
		minutes = "0" + minutes;
	}
	if (seconds / 10 < 1) {
		seconds = "0" + seconds;
	}
	return `${hours}:${minutes}:${seconds} ${zone}`;
};

function displayTime() {
	let currentTime = new Date();
	let hours = currentTime.getHours();
	let minutes = currentTime.getMinutes();
	let seconds = currentTime.getSeconds();
	let zone = hours >= 12 ? "PM" : "AM";
	if (hours > 12) {
		hours = hours % 12;
	}
	hours = hours ? hours : 12;
	let timeString = getTimeString({
		hours,
		minutes,
		seconds,
		zone
	});
	checkAlarm(timeString);
	currentTimeHTML.text(timeString);
	let refresh = 50;
	myTime = setTimeout('displayTime()', refresh);
};