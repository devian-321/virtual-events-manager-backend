class User {
    constructor(id, username, password, role = 'attendee') {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.registeredEvents = [];
    }
}

module.exports = User;