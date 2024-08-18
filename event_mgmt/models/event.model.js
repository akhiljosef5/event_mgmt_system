class Event {
    constructor(id, date, time, description, organizer) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.description = description;
        this.organizer = organizer;
        this.participants = [];
    }

    addParticipant(user) {
        this.participants.push(user);
    }
}

module.exports = {Event};
