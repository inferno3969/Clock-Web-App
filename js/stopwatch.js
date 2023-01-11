$(document).ready(function() {
	stopwatchPauseButton.prop("disabled", true);
	stopwatchResetButton.prop("disabled", true);
});

const stopwatchTime = $("#stopwatch-time");
const stopwatchStartButton = $("#stopwatch-start-btn");
const stopwatchPauseButton = $("#stopwatch-pause-btn");
const stopwatchResetButton = $("#stopwatch-reset-btn");

let prevTime, stopwatchInterval, elapsedTime = 0;

function updateStopwatchTime() {
	let time = elapsedTime;

	let diffInHrs = time / 3600000;
	let hh = Math.floor(diffInHrs);

	let diffInMin = (diffInHrs - hh) * 60;
	let mm = Math.floor(diffInMin);

	let diffInSec = (diffInMin - mm) * 60;
	let ss = Math.floor(diffInSec);

	let diffInMs = (diffInSec - ss) * 100;
	let ms = Math.floor(diffInMs);

	stopwatchTime.text(
		(hh < 10 ? "0" : "") + hh + ":" +
		(mm < 10 ? "0" : "") + mm + ":" +
		(ss < 10 ? "0" : "") + ss + "." + ms);
}

function startStopwatch() {
	if (stopwatchInterval == null) {
		stopwatchInterval = setInterval(function() {
			if (prevTime == null) {
				prevTime = Date.now();
			}
			elapsedTime += Date.now() - prevTime;
			prevTime = Date.now();
			updateStopwatchTime();
		}, 50);
		stopwatchStartButton.prop("disabled", true);
		stopwatchPauseButton.prop("disabled", false);
		stopwatchResetButton.prop("disabled", true);
	}
}

function pauseStopwatch() {
	if (stopwatchInterval != null) {
		clearInterval(stopwatchInterval);
		stopwatchInterval = null;
	}
	prevTime = null;
	stopwatchStartButton.text("Resume");
	stopwatchStartButton.prop("disabled", false);
	stopwatchPauseButton.prop("disabled", true);
	stopwatchResetButton.prop("disabled", false);
}

function resetStopwatch() {
	elapsedTime = 0;
	updateStopwatchTime();
	stopwatchStartButton.text("Start");
	stopwatchResetButton.prop("disabled", true);
}