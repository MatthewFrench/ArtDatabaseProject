const bcrypt = require('bcrypt');
const saltRounds = 10;

export class Utility {
    public static async encryptString(string) : Promise<String> {
        return await bcrypt.hash(string, saltRounds);
    }
    public static async compareStringToEncryptedString(string, encrypted) : Promise<boolean> {
        return await bcrypt.compare(string, encrypted);
    }
}