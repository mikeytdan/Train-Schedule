// Initialize Firebase
var config = {
    apiKey: "AIzaSyAcnzqWjPXEHNm9Noaw-U3zFuxijK7Yw0I",
    authDomain: "train-schedule-a83a5.firebaseapp.com",
    databaseURL: "https://train-schedule-a83a5.firebaseio.com",
    projectId: "train-schedule-a83a5",
    storageBucket: "",
    messagingSenderId: "1043268163991"
};

firebase.initializeApp(config);

var database = firebase.database();
var trainsRef = database.ref('trains/');

function addTrain(train) {
    var startDate = moment.unix(train.startTime);
    var frequency = parseInt(train.frequency);
    var row = $("<tr>");
    row.append("<td>" + train.name + "</td>");
    row.append("<td>" + train.destination + "</td>");
    row.append("<td>" + frequency + "</td>");

    var currentDate = moment()
    var diff = startDate.diff(currentDate, "minute");
    var remainder = diff % train.frequency;
    var minutesAway = frequency + remainder
    currentDate = currentDate.add(remainder + frequency, "minutes");

    row.append("<td>" + currentDate.local().format("HH:mm") + "</td>");
    row.append("<td>" + minutesAway + "</td>");
    $(".table tbody").append(row);
};

trainsRef.orderByChild("dateAdded").on("child_added", function (snapshot, prevChildKey) {
    var train = snapshot.val();
    addTrain(train);
});

$("#submit").on("click", function (event) {
    event.preventDefault();

    var name = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var startTime = $("#startTime").val().trim();
    var frequency = $("#frequency").val().trim();

    trainsRef.push({
        name: name,
        destination: destination,
        startTime: moment(startTime, "HH:mm").unix(),
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $("#trainName").val("");
    $("#destination").val("");
    $("#startTime").val("");
    $("#frequency").val("");
});