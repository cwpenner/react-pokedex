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
            let words = text.split(/[_-]/);
            words = words.map(word => {
                return this.toTitleCase(word);
            });
            const newText = words.join(' ');
            return newText;
        }
    }
}