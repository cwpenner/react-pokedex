export default class Utilites {
    static toTitleCase(text) {
        if (text) {
            if (text.length > 1) {
                return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            } else {
                return text.toUpperCase();
            }
        }
    }

    static normalizeText(text) {
        if (text) {
            return text.replace(/_/g, ' ');
        }
    }
}