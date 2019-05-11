const self = this;

export default () => {
    self.addEventListener('message', async event => {
        if (!event) {
            return;
        }

        switch (event.data.message) {
            case 'downloadAll':
                downloadAll(event.data.lang);
                break;
            default:
                console.log('Worker received invalid event');
        }

        postMessage('Complete');
    });
    
    async function downloadAll(lang) {
        const base = self.origin;
        const response = await fetch(base + '/pokemon/list?lang=' + lang);
        const data = await response.json();

        if (data.pokemon_entries) {
            postMessage({
                message: 'listDownloaded',
                total: data.pokemon_entries.length
            });

            for (const pokemon of data.pokemon_entries) {
                if (pokemon.entry_number) {
                    downloadPokemon(pokemon.entry_number, lang, data.pokemon_entries.length);
                }
            }
        }
    }

    async function downloadPokemon(id, lang, total) {
        const base = self.origin;
        const response = await fetch(base + '/pokemon/view?id=' + id + '&lang=' + lang);
        const data = await response.json();

        if (data) {
            postMessage({
                message: 'pokemonDownloaded',
                id: id,
                lang: lang,
                data: data
            });
        }

        if (id === total) {
            postMessage({
                message: 'downloadingComplete'
            });
        }
    }
};