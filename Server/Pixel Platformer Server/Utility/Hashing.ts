const bcrypt = require('bcrypt');
const saltRounds = 10;

export class Hashing {
    public static async hashString(string) : Promise<String> {
        return await bcrypt.hash(string, saltRounds);
    }
    public static async compareStringToHashedString(string, encrypted) : Promise<boolean> {
        return await bcrypt.compare(string, encrypted);
    }
}