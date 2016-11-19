const ApiKey = "AIzaSyBk1PVuX1v8TR3kZNQcIRMN9D0_dL6iUDo";
let rest = require("restler");

class Event {
    constructor(accessToken, calendarID = "primary") {
        this.destinationURL = "https://www.googleapis.com/calendar/v3/calendars/" + calendarID;
        this.accessToken = accessToken;
        this.calendarID = calendarID;
    }

    all(callback) {
        rest.get(this.destinationURL + "/events", this.defaultInfo())
            .on("complete", callback);
    }

    create(eventOptions, callback) {
        var eventOptionsString = JSON.stringify(eventOptions);

        var data = {
            "data" : eventOptionsString
        }

        var options = Object.assign({}, this.defaultInfo(), data);

        rest.post(this.destinationURL + "/events", options)
            .on("complete", callback);
    }

    defaultInfo() {
        return {
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + this.accessToken
            }
        }
    }
}

module.exports = Event;