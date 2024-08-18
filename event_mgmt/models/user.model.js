// models/user.js

class User {
    constructor(username, email, password, role) {
        this.username = username;
        this.email = email;
        this.password = password; // Hashed password
        this.role = role; // Either 'organizer' or 'attendee'
    }
}

module.exports = User;
