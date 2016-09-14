
// 1. Initialize Firebase

   // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCKu8RakHAfCjb62ANA4wV9t_KM3k6JNdw",
    authDomain: "train-schedule-95105.firebaseapp.com",
    databaseURL: "https://train-schedule-95105.firebaseio.com",
    storageBucket: "train-schedule-95105.appspot.com",
  };
  firebase.initializeApp(config);

var database = firebase.database();


// 2. Button for adding Employees
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
		firstTrainTime: firstTrainTime,
		frequency: frequency
	};

	// Uploads schedule data to the database
	database.ref().push(schedule);

	// Logs everything to console
	console.log(schedule.trainName);
	console.log(schedule.destination);
	console.log(schedule.firstTrainTime);
	console.log(schedule.frequency);

	// Alert
	alert("Train Schedule successfully added");

	// Clears all of the text-boxes
	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#firstTrainTimeInput").val("");
	$("#frequencyInput").val("");

	// Prevents moving to new page
	return false;
});


// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey){

	console.log(childSnapshot.val());

	// Store everything into a variable.
	var trainName = childSnapshot.val().trainName;
	var destination = childSnapshot.val().destination;
	var firstTrainTime = childSnapshot.val().firstTrainTime;
	var frequency = childSnapshot.val().frequency;

	// Employee Info
	console.log(trainName);
	console.log(destination);
	console.log(firstTrainTime);
	console.log(frequency);

	var memObj = moment(firstTrainTime, "HH:mm");
	var localTime = memObj.format('LT');
	var nextArrival = localTime;
	var minutesAway = 0;
	console.log(memObj);
	console.log(localTime);



	// Add each train's data into the table
	var tr = $('<tr>');
	var td = $('<td>').html(trainName);
	tr.append(td);
	td = $('<td>').html(destination);
	tr.append(td);
	td = $('<td>').html(frequency);
	tr.append(td);
	td = $('<td>').attr('id', 'nextArrival').html(nextArrival);
	tr.append(td);
	td = $('<td>').attr('id', 'minutesAway').html(minutesAway);
	tr.append(td);
	$("#trainTable > tbody").append(tr);

});


// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use mets this test case



