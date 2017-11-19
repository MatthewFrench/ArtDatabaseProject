const bcrypt = require('bcryptjs');
const saltRounds = 10;

export class Hashing {
    static async hashString(string) {
        return await bcrypt.hash(string, saltRounds);
    }
    static async compareStringToHashedString(string, encrypted) {
        return await bcrypt.compare(string, encrypted);
    }
}