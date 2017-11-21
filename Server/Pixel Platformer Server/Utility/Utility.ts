
export class Utility {
    public static SanitizeHTML(str) {
        return String(str).replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;').
        replace(/"/g, '&quot;');
    }
}