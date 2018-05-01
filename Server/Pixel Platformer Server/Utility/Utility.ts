
export class Utility {
    public static SanitizeHTML(str) {
        return String(str).replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;').
        replace(/"/g, '&quot;');
    }

    //Allows sleeping for a time period on async functions
    public static Sleep = ms => new Promise(res => setTimeout(res, ms));
}