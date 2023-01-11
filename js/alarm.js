$(document).ready(function() {
	alarmForm.trigger("reset");
});

const submitAlarmButton = $("#submit-alarm-btn");
const resetAlarmButton = $("#reset-alarm-btn");
const editAlarmButton = $("#edit-alarm-btn");

const alarmForm = $("#alarm-form");

const alarmHrInput = $("#alarm-hours");
const alarmMinInput = $("#alarm-minutes");
const alarmZoneSelection = $("#alarm-zone");

const createAlarmBlock = $("#create-alarm");
const activeAlarmBlock = $("#active-alarm");

const alarmText = $("#alarm-text");
const alarmTimeText = $("#alarm-time");
const toastAlarmText = $("#toast-alarm-text");
const alarmToast = $("#alarm-toast");

const alarmAudio = $("#alarm-audio");

const alarmMinHr = 0,
	alarmMaxHr = 12;
const alarmMinMin = 0,
	alarmMaxMin = 59;

let alarmString = null;
let alarmInterval, alarmTimeout;
let isEditing = false;

alarmHrInput.on("input", function() {
	let hrNum = Number(alarmHrInput.val());
	hrNum = Math.min(hrNum, alarmMaxHr);
	hrNum = Math.max(hrNum, alarmMinHr);
	$(this).val(hrNum);
});

alarmMinInput.on("input", function() {
	let minNum = Number(alarmMinInput.val());
	minNum = Math.min(minNum, alarmMaxMin);
	minNum = Math.max(minNum, alarmMinMin);
	$(this).val(minNum);
});

function submitAlarm() {
	$("#alarm-form").submit(function(event) {
		event.preventDefault();
		let form = $(this);
		let hour = form.find('[name="hour"]');
		let min = form.find('[name="min"]');
		let zone = form.find('[name="zone"]');
		alarmString = getTimeString({
			hours: hour.val(),
			minutes: min.val(),
			seconds: 00,
			zone: zone.val()
		});
		createAlarmBlock.css("display", "none");
		activeAlarmBlock.css("display", "block");
		resetAlarmButton.css("visibility", "visible");
		editAlarmButton.css("visibility", "visible");
		editAlarmButton.prop("disabled", false);
		alarmText.text("Alarm set for");
		alarmTimeText.text(alarmString);
	});
}

function editAlarm() {
	clearInterval(alarmInterval);
	alarmInterval = null;
    alarmTimeout = null;
    alarmString = null;
	createAlarmBlock.css("display", "block");
	activeAlarmBlock.css("display", "none");
}

function resetAlarm() {
	clearInterval(alarmInterval);
	alarmInterval = null;
    alarmTimeout = null;
    alarmString = null;
	alarmForm.trigger("reset");
	createAlarmBlock.css("display", "block");
	activeAlarmBlock.css("display", "none");
}

function checkAlarm(timeString) {
	if (alarmString === timeString && alarmTimeout == null) {
		alarmTimeout = setTimeout(function() {
			editAlarmButton.prop("disabled", true);
			alarmAudio.trigger("play");
			toastAlarmText.text(alarmString);
			const toast = new bootstrap.Toast(alarmToast);
			toast.show();
			clearTimeout(alarmTimeout);
			if (alarmInterval == null) {
				alarmInterval = setInterval(function() {
					alarmAudio.trigger("play");
				}, 1000);
			}
		}, 0);
	}
};