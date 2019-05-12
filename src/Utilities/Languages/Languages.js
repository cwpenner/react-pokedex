export default class Languages {
    // Contains the supported language string localizations

    static languages = {
        en: {
            language: 'Language',
            downloadAll: 'Download All',
            downloadAllHint: 'Download all Pokémon for offline use',
            downloading: 'Downloading',
            characteristics: 'Characteristics',
            height: 'Height',
            weight: 'Weight',
            types: 'Types',
            habitat: 'Habitat',
            stats: 'Stats',
            imageSelector: 'Image Selector',
            evoChain: 'Evolution Chain',
            back_default: 'Back Default',
            back_female: 'Back Female',
            back_shiny: 'Back Shiny',
            back_shiny_female: 'Back Shiny Female',
            front_default: 'Front Default',
            front_female: 'Front Female',
            front_shiny: 'Front Shiny',
            front_shiny_female: 'Front Shiny Female'
        },
        fr: {
            language: 'Langue',
            downloadAll: 'Tout télécharger',
            downloadAllHint: 'Téléchargez tous les Pokémon pour une utilisation hors ligne',
            downloading: 'Téléchargement',
            characteristics: 'Caractéristiques',
            height: 'Taille',
            weight: 'Poids',
            types: 'Types',
            habitat: 'Habitat',
            stats: 'Statistiques',
            imageSelector: 'Sélecteur d\'image',
            evoChain: 'Évolutions',
            back_default: 'Arrière par défaut',
            back_female: 'Arrière femme',
            back_shiny: 'Arrière brillant',
            back_shiny_female: 'Arrière brillant femme',
            front_default: 'Avant défaut',
            front_female: 'Avant femme',
            front_shiny: 'Avant brillant',
            front_shiny_female: 'Avant brillant femme'
        },
        es: {
            language: 'Idioma',
            downloadAll: 'Descargar todo',
            downloadAllHint: 'Descargar todos los Pokémon para uso sin conexión',
            downloading: 'Descargando',
            characteristics: 'Caracteristicas',
            height: 'Altura',
            weight: 'Peso',
            types: 'Tipos',
            habitat: 'Habitat',
            stats: 'Estadística',
            imageSelector: 'Selector de imagen',
            evoChain: 'Evoluciones',
            back_default: 'Trasero estándar',
            back_female: 'Trasero hembra',
            back_shiny: 'Trasero brillante',
            back_shiny_female: 'Trasero brillante hembra',
            front_default: 'Frente estándar',
            front_female: 'Frente hembra',
            front_shiny: 'Frente brillante',
            front_shiny_female: 'Frente brillante hembra'
        },
        de: {
            language: 'Sprache',
            downloadAll: 'Alles herunterladen',
            downloadAllHint: 'Lade alle Pokémon für die Offline-Nutzung herunter',
            downloading: 'wird heruntergeladen',
            characteristics: 'Eigenschaften',
            height: 'Höhe',
            weight: 'Gewicht',
            types: 'Typen',
            habitat: 'Lebensraum',
            stats: 'Statistiken',
            imageSelector: 'Bildauswahl',
            evoChain: 'Entwicklungen',
            back_default: 'Hintere standard',
            back_female: 'Hintere Frau',
            back_shiny: 'Hinten glänzende',
            back_shiny_female: 'Hintere glänzende Frau',
            front_default: 'Vorderseite standard',
            front_female: 'Vordere Frau',
            front_shiny: 'Vorne glänzend',
            front_shiny_female: 'Vordere glänzende Frau'
        },
        it: {
            language: 'Linguaggio',
            downloadAll: 'Scarica tutto',
            downloadAllHint: 'Scarica tutti i Pokémon per l\'utilizzo offline',
            downloading: 'Scaricamento',
            characteristics: 'Caratteristiche',
            height: 'Altezza',
            weight: 'Peso',
            types: 'Tipi',
            habitat: 'Habitat',
            stats: 'Statistica',
            imageSelector: 'Selettore di immagini',
            evoChain: 'Evoluzioni',
            back_default: 'Posteriore',
            back_female: 'Posteriore femminile',
            back_shiny: 'Posteriore lucido',
            back_shiny_female: 'Posteriore lucido femminile',
            front_default: 'Frontale',
            front_female: 'Frontale femminile',
            front_shiny: 'Frontale lucido',
            front_shiny_female: 'Frontale lucido femminile'
        }
    };

    static supportedLanguages = ['en', 'fr', 'de', 'es', 'it'];

    static getLocalizedText(lang, text) {
        if (this.languages[lang] && this.languages[lang][text]) {
            return this.languages[lang][text]
        }
    }
}
