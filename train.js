// Global Variables
var rows = [];
var database;

// Functions
function calculated(obj) {
	var nextArrival = "0:00 AM";
	var minutesAway = 0;
	// convert "HH:mm" from Firebase to memont object
	var todaysFirstTrainTime = moment(obj.firstTrainTime, "HH:mm");
	
	var diffMinutes = moment().diff(todaysFirstTrainTime, "minutes");
	//console.log('diff: ' + diffMinutes);
	if (diffMinutes < 0) {
		// current time is earlier than todaysFirstTrainTime
		// then nextArrival is todaysFirstTrainTime
		// absolute value of diffMinutes is minutesAway
		nextArrival = todaysFirstTrainTime.format('LT');
		minutesAway = Math.abs(diffMinutes);
	} else {
		minutesAway = obj.frequency - (diffMinutes % obj.frequency);
		nextArrival = moment().add(minutesAway, "minutes").format('LT');
	}

	return {
		nextArrival: nextArrival,
		minutesAway: minutesAway
	};
}
function refreshIt() {
	var tableRows = $('#trainTable > tbody > tr');

	tableRows.each(function(index) {
		var tr = $(this)
		var calculatedObj = calculated(rows[index]);
		tr.children().each(function(i) {
			var td = $(this);
			//console.log(td);
			if (td.hasClass('nextArrival')) {
				td.html(calculatedObj.nextArrival);
			}
			if (td.hasClass('minutesAway')) {
				td.html(calculatedObj.minutesAway)
			}
		});

	});
}
function createTableRow(obj) {
	var calculatedObj = calculated(obj);

	var tr = $('<tr>');
	var td = $('<td>').html(obj.trainName);
	tr.append(td);
	td = $('<td>').html(obj.destination);
	tr.append(td);
	td = $('<td>').html(obj.frequency);
	tr.append(td);
	td = $('<td>').addClass('nextArrival').html(calculatedObj.nextArrival);
	tr.append(td);
	td = $('<td>').addClass('minutesAway').html(calculatedObj.minutesAway);
	tr.append(td);
	$("#trainTable > tbody").append(tr);

}

// Execution
$(document).ready(readyFn);
function readyFn() {
	// 1. Initialize Firebase
  	var config = {
 		apiKey: "AIzaSyCKu8RakHAfCjb62ANA4wV9t_KM3k6JNdw",
  		authDomain: "train-schedule-95105.firebaseapp.com",
   		databaseURL: "https://train-schedule-95105.firebaseio.com",
   		storageBucket: "train-schedule-95105.appspot.com",
 	};

 	firebase.initializeApp(config);

	database = firebase.database();

	// 2. Button for adding Train Info
	$("#addTraineBtn").on("click", function(){

		// Grabs user input
		var trainName = $("#trainNameInput").val().trim();
		var destination = $("#destinationInput").val().trim();
		var firstTrainTime = $("#firstTrainTimeInput").val().trim();
		var frequency = parseInt($("#frequencyInput").val().trim());

		// Creates local "temporary" object for holding schedule data
		var schedule = {
			trainName:  trainName,
			destination: destination,
			firstTrainTime: firstTrainTime, // save it in "HH:mm" format
			frequency: frequency
		};

		// Uploads schedule data to the database
		database.ref().push(schedule);

		// Clears all of the text-boxes
		$("#trainNameInput").val("");
		$("#destinationInput").val("");
		$("#firstTrainTimeInput").val("");
		$("#frequencyInput").val("");

		// Prevents moving to new page
		return false;
	});

	// 3. Create Firebase event for adding train info to the database and a row in the html when a user adds an entry
	database.ref().on("child_added", function(childSnapshot, prevChildKey){

		//console.log(childSnapshot.val());
		if (childSnapshot.val() == null) return;

		rows.push(childSnapshot.val());
		createTableRow(childSnapshot.val());
	});

	// start timer
	setInterval(refreshIt, 60000);
}


