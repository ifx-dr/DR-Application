//define the user model

const users =[];

class User {
    constructor(username, password){
        this.username=username;
        this.password=password;
    }

    static findByUsername(username) {
        return users.find((user) => user.username === username);
      }
    
    static save(user) {
        users.push(user);
    }
}

module.exports = User;