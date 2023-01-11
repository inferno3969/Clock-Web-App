$(document).ready(function() {
	pauseResumeTimerButton.prop("disabled", true);
	resetTimerButton.prop("disabled", true);
	durationForm.trigger("reset");
});

const startTimerButton = $("#start-timer-btn");
const pauseResumeTimerButton = $("#pause-resume-timer-btn");
const resetTimerButton = $("#reset-timer-btn");

const timer = $("#timer");
const progressBar = $("#progress-bar");
const timerDisplay = $("#timer-display");

const durationForm = $("#duration-form");

const timerHrInput = $("#timer-hours");
const timerMinInput = $("#timer-minutes");
const timerSecInput = $("#timer-seconds");

const timerMinHr = 0;
const timerMinMin = 0,
	timerMaxMin = 59;
const timerMinSec = 0,
	timerMaxSec = 59;

const timerToast = $("#timer-toast");

const beepAudio = $("#timer-beep-audio");

let timerRunning = true;
let timerPaused = false;

let timeRemaining, timerInterval, timerBeepInterval, timerBeepTimeout, counter = 0,
	startTime, duration;

timerHrInput.on("input", function() {
	let hrNum = Number(timerHrInput.val());
	hrNum = Math.max(hrNum, timerMinHr);
	$(this).val(hrNum);
});

timerMinInput.on("input", function() {
	let minNum = Number(timerMinInput.val());
	minNum = Math.min(minNum, timerMaxMin);
	minNum = Math.max(minNum, timerMinMin);
	$(this).val(minNum);
});

timerSecInput.on("input", function() {
	let num = Number(timerSecInput.val());
	num = Math.min(num, timerMaxSec);
	num = Math.max(num, timerMinSec);
	$(this).val(num);
});

pauseResumeTimerButton.click(function() {
	if (timerRunning && !timerPaused) {
		pauseTimer();
	} else {
		resumeTimer();
	}
});

function submitTimer() {

	durationForm.submit(function(event) {
		event.preventDefault();
		timerHrInput.prop("disabled", true);
		timerMinInput.prop("disabled", true);
		timerSecInput.prop("disabled", true);
		startTimerButton.prop("disabled", true);
		pauseResumeTimerButton.prop("disabled", false);
		duration = (timerHrInput.val() * 3600 + timerMinInput.val() * 6 + timerSecInput.val()) * 1000;
		startTime = Date.now() + duration;
		timerRunning = true;
		if (timerInterval == null) {
			timerInterval = setInterval(function() {
				if (timerRunning) {
					timeRemaining = (startTime) - Date.now();
					updateProgressBar(timeRemaining);
					updateTimerDisplay(timeRemaining + 1000);
					if (timeRemaining <= 0) {
						if (timerBeepTimeout == null) {
							timerBeepTimeout = setTimeout(function() {
								beepAudio.trigger("play");
								const toast = new bootstrap.Toast(timerToast);
								toast.show();
								clearTimeout(timerBeepTimeout);
								timerBeepTimeout = null;
								if (timerBeepInterval == null) {
									timerBeepInterval = setInterval(function() {
										beepAudio.trigger("play");
									}, 1000);
								}
							}, 0);
						}
						timerDisplay.text("00:00:00");
						progressBar.css("width", 0);
						progressBar.css("height", 0);
						clearInterval(timerInterval);
						pauseResumeTimerButton.prop("disabled", true);
						resetTimerButton.prop("disabled", false);
						return;
					}
				}
			}, 0);
		}
	});
}

function pauseTimer() {
	clearInterval(timerInterval);
	timerPaused = true;
	timerRunning = false;
	progressBar.css("background-color", "#FFC107");
	pauseResumeTimerButton.text("Resume");
	resetTimerButton.prop("disabled", false);
}

function resumeTimer() {
	timerPaused = false;
	pauseResumeTimerButton.text("Pause");
	startTime = startTime - timeRemaining;
	timerInterval = setInterval(function() {
		if (timerRunning) {
			// might be a very tiny bit off, but it's accurate that it doesn't make a big difference
			// unless you really nitpick it.
			timeRemaining -= 4.978;
			updateProgressBar(timeRemaining);
			updateTimerDisplay(timeRemaining + 1000);
			if (timeRemaining <= 0) {
				if (timerBeepTimeout == null) {
					timerBeepTimeout = setTimeout(function() {
						beepAudio.trigger("play");
						const toast = new bootstrap.Toast(timerToast);
						toast.show();
						clearTimeout(timerBeepTimeout);
						timerBeepTimeout = null;
						if (timerBeepInterval == null) {
							timerBeepInterval = setInterval(function() {
								beepAudio.trigger("play");
							}, 1000);
						}
					}, 0);
				}
				timerDisplay.text("00:00:00");
				progressBar.css("width", 0);
				progressBar.css("height", 0);
				clearInterval(timerInterval);
				pauseResumeTimerButton.prop("disabled", true);
				resetTimerButton.prop("disabled", false);
				return;
			}
		}
	}, 0);
}

function resetTimer() {
	clearInterval(timerInterval);
	clearInterval(timerBeepInterval);
	timeRemaining = 0;
	timerInterval = null;
	timerBeepInterval = null;
	timerRunning = true;
	timerPaused = false;
	startTimerButton.prop("disabled", false);
	pauseResumeTimerButton.prop("disabled", true);
	pauseResumeTimerButton.text("Pause");
	resetTimerButton.prop("disabled", true);
	timerHrInput.prop("disabled", false);
	timerMinInput.prop("disabled", false);
	timerSecInput.prop("disabled", false);
	durationForm.trigger("reset");
	updateProgressBar(timeRemaining);
	updateTimerDisplay(timeRemaining);
	timerDisplay.text("00:00:00");
}

function updateProgressBar(timeRemaining) {
	const elapsedPercentage = (timeRemaining / (duration * 0.01));

	progressBar.css("width", elapsedPercentage + "%");
	progressBar.css("height", elapsedPercentage + "%");

	if (timeRemaining <= duration) {
		progressBar.css("background-color", "#0D6EFD");
	}

	if (timeRemaining <= 10000) {
		progressBar.css("background-color", "#DC3545");
	}
}

function updateTimerDisplay(timeRemaining) {
	const hoursRemaining = Math.floor(timeRemaining / 3600000);
	const minutesRemaining = Math.floor((timeRemaining % 3600000) / 60000);
	// + 1 added to correctly display the seconds
	const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);

	timerDisplay.text(
		(hoursRemaining < 10 ? "0" : "") + hoursRemaining + ":" +
		(minutesRemaining < 10 ? "0" : "") + minutesRemaining + ":" +
		(secondsRemaining < 10 ? "0" : "") + secondsRemaining);
}