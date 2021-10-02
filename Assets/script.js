function getCurrentHour() {
    // will return current hour as "9AM" or "5PM" format
    const now = moment().add(12, "hours");

    return now.format("h").concat(now.format("A"));
}

// Initial function to execute one the page is loaded
function loadSchedule() {
    const currentHour = getCurrentHour();

    const amPm = currentHour.substring(
        currentHour.length - 2,
        currentHour.length
    );

    const numHour = Number(currentHour.substring(0, currentHour.length - 2));

    // find all the input textarea elements
    var allInputBoxes = document.querySelectorAll("[id=input_event]");
    // find all the save buttons
    var allButtons = document.querySelectorAll("[id=saveBtn]");

    // Retrieve data from local storage
    var fromStorage = localStorage.getItem("scheduler");
    var date = moment().format("YYYY-MM-DD");

    // loop thru all input text area to populate background color and events from local storage
    for (let i = 0; i < allInputBoxes.length; i++) {
        const vHour = i + 9;
        const now =
            numHour < 12 ?
            amPm === "PM" ?
            numHour + 12 :
            numHour :
            amPm === "AM" ?
            0 :
            12;

        if (vHour < now) {
            allInputBoxes[i].className = "past";
            allInputBoxes[i].disabled = true;
        } else if (vHour === now) {
            allInputBoxes[i].className = "present";
        } else {
            allInputBoxes[i].className = "future";
        }

        // Convert JSON string to JSON Object
        var fromStorageObj = JSON.parse(fromStorage);
        if (fromStorage !== null) {
            var storageIndex = findSameTimeIndex(
                date,
                getHourByIndex(i),
                fromStorageObj
            );

            if (storageIndex !== -1) {
                // Populate event from storage to textarea if found matching record
                allInputBoxes[i].value = fromStorageObj[storageIndex].event;
            }
        }

        // initial load, all save buttons disable. will enable unless you type something.
        allButtons[i].disabled = true;
    }
}

// Check if textarea if it's empty, if empty, disable save button
function checkEnableSave(value) {
    var inx = getIndexByHour(value);
    var allInputBoxes = document.querySelectorAll("[id=input_event]");
    const scheduleText = allInputBoxes[inx].value;
    var allButtons = document.querySelectorAll("[id=saveBtn]");

    if (scheduleText.trim().length > 0) {
        allButtons[inx].disabled = false;
    } else {
        allButtons[inx].disabled = true;
    }
}

// Handle save event
function handleSave(value) {
    var allInputBoxes = document.querySelectorAll("[id=input_event]");
    const scheduleText = allInputBoxes[getIndexByHour(value)].value;

    var now = moment().format("YYYY-MM-DD");

    var fromStorage = localStorage.getItem("scheduler");
    var toSave = { date: now, time: value, event: scheduleText };

    // find local storage if already have something
    if (fromStorage === null) {
        // nothing in  local storage, just save a new schedule list
        var schedulerList = [];
        schedulerList.push(toSave);
        // Local storage only save as key value pair, convert JSON Object to JSON String before save
        localStorage.setItem("scheduler", JSON.stringify(schedulerList));
    } else {
        // found something, check if it's the same hour, if yes, remove the old one before save
        var vFromStorage = JSON.parse(fromStorage);
        const index = findSameTimeIndex(now, value, vFromStorage);
        if (index !== -1) {
            // Remove old event
            vFromStorage.splice(index, 1);
        }
        // Insert new event
        vFromStorage.push(toSave);
        localStorage.setItem("scheduler", JSON.stringify(vFromStorage));
    }

    // Advise user save successfully
    alert("Event saved: " + JSON.stringify(toSave));
}

// Find the matching event in from the array, same date and same time
function findSameTimeIndex(date, time, fromStorage) {
    console.log(fromStorage);
    var inx = -1;
    for (let i = 0; i < fromStorage.length; i++) {
        if (fromStorage[i].date === date && fromStorage[i].time === time) {
            inx = i;
            break;
        }
    }

    return inx;
}

function getHourByIndex(value) {
    var hour = "";
    switch (value) {
        case 0:
            hour = "9AM";
            break;
        case 1:
            hour = "10AM";
            break;
        case 2:
            hour = "11AM";
            break;
        case 3:
            hour = "12PM";
            break;
        case 4:
            hour = "1PM";
            break;
        case 5:
            hour = "2PM";
            break;
        case 6:
            hour = "3PM";
            break;
        case 7:
            hour = "4PM";
            break;
        case 8:
            hour = "5PM";
            break;
        default:
    }

    return hour;
}

function getIndexByHour(value) {
    var index = 0;
    switch (value) {
        case "9AM":
            index = 0;
            break;
        case "10AM":
            index = 1;
            break;
        case "11AM":
            index = 2;
            break;
        case "12PM":
            index = 3;
            break;
        case "1PM":
            index = 4;
            break;
        case "2PM":
            index = 5;
            break;
        case "3PM":
            index = 6;
            break;
        case "4PM":
            index = 7;
            break;
        case "5PM":
            index = 8;
            break;
        default:
    }

    return index;
}

// Execute the loadSchedule function after the document is ready. To avoid UI elements not yet build when executing
window.addEventListener(
    "DOMContentLoaded",
    function() {
        loadSchedule();
    },
    false
);