import React from 'react';
import './App.css';
import PokeProfile from './Components/PokeProfile/PokeProfile';
import PokeList from './Components/PokeList/PokeList';
import worker from './Workers/worker';
import WebWorker from './Workers/WebWorker';
import Languages from './Utilities/Languages/Languages'

class App extends React.Component {
    // Main app

    worker;

	constructor() {
		super();
		this.state = {
            profileLoading: false,
            listLoading: false,
            list: [],
            language: 'en',
            languages: [],
            languageUpdating: false,
            selectedPokemonId: 25,
            selectedPokemon: {},
            downloading: false,
            downloadId: 0,
            downloadTotal: 0
        };
	}

	componentDidMount() {
        // Create background Worker to handle background downloading
        this.worker = new WebWorker(worker);
        this.worker.addEventListener('message', event => {
            if (event.data.message === 'listDownloaded') {
                this.setState({
                    downloadTotal: event.data.total
                });
            }

            if (event.data.message === 'downloadingComplete') {
                this.setState({
                    downloading: false
                });
            }

            if (event.data.message === 'pokemonDownloaded') {
                this.setState({
                    downloadId: event.data.id
                });
                localStorage.setItem(event.data.id + '-' + event.data.lang, JSON.stringify(event.data.data));
            }
        });

        // Get previous settings from local storage, if available
        let lang = localStorage.getItem('lang');
        let selectedPokemonId = localStorage.getItem('selectedPokemonId');

        if (lang) {
            this.setState({ language: lang });
        } else {
            lang = this.state.language;
        }

        if (selectedPokemonId) {
            this.setState({ selectedPokemonId: selectedPokemonId });
        } else {
            selectedPokemonId = this.state.selectedPokemonId;
        }

        // Update language list, Pokémon list, and selected Pokémon info
        this.getLanguages();
        this.getPokedexInfo(lang);
        this.getPokemonInfo(selectedPokemonId, lang);
    }

    handleChange = (event) => {
        // Handles the language change dropdown

        const {name, value} = event.target;

		this.setState({
			[name]: value
        });
        localStorage.setItem('lang', value);

        this.getPokedexInfo(value);
        this.getPokemonInfo(this.state.selectedPokemonId, value);
    }
    
    async getPokedexInfo(lang) {
        // Gets the list of Pokémon to display

        this.setState({ listLoading: true });
        
        const list = localStorage.getItem('list-' + lang);

        if (list) { // Load from local storage if available
            this.setState({
                list: JSON.parse(list)
            });
            this.setState({ listLoading: false });
        } else {
            const response = await fetch('/pokemon/list?lang=' + lang);
            const data = await response.json();
            console.log('Pokelist data', data);
    
            if (data) {
                if (data.pokemon_entries) {
                    this.setState({
                        list: data.pokemon_entries
                    });

                    // Store list locally for faster page reloads
                    localStorage.setItem('list-' + lang, JSON.stringify(data.pokemon_entries));
                    this.setState({ listLoading: false });
                }
            }
        } 
    }

    async getPokemonInfo(id, lang) {
        // Gets the info for the selected Pokémon

        this.setState({ profileLoading: true });
        
        const pokemon = localStorage.getItem(id + '-' + lang);

        if (pokemon) { // Load from local storage if available
            this.setState({
                selectedPokemon: JSON.parse(pokemon)
            });
        } else {
            const response = await fetch('/pokemon/view?id=' + id + '&lang=' + lang);
            const data = await response.json();
            console.log('Pokedata', data);
    
            if (data) {
                this.setState({
                    selectedPokemon: data
                });

                // Store Pokémon info locally for faster page reloads
                localStorage.setItem(data.number + '-' + lang, JSON.stringify(data));
            }
        }

        this.setState({ profileLoading: false });
    }
    
    selectPokemon = (id) => {
        // Changes actively selected Pokémon

        this.setState({ selectedPokemonId: id });
        localStorage.setItem('selectedPokemonId', id);
        this.getPokemonInfo(id, this.state.language);
    }

    async getLanguages() {
        // Gets the list of languages the API works with

        const langs = localStorage.getItem('languages');

        if (langs) { // Load from local storage if available
            this.setState({ languages: JSON.parse(langs) });
        } else {
            const response = await fetch('/pokemon/getLanguages');
            const data = await response.json();
            console.log('Language data', data);
    
            if (data && data.results) {
                const languages = [];
                data.results.forEach(lang => {
                    if (Languages.supportedLanguages.includes(lang.name)) {
                        // Only present languages the app has been translated in
                        languages.push(lang.name);
                    }
                });
                this.setState({ languages: languages });
                localStorage.setItem('languages', JSON.stringify(languages));
            }
        }
    }

    dropdown() {
        // Language dropdown
        
        return (
            <select id="language" name="language" className="lang-dropdown" value={this.state.language} onChange={this.handleChange}>                
                {this.state.languages.map(lang => {
                    return <option key={lang} value={lang}>{lang}</option>
                })}
            </select>
        );
    }

    downloadAll = () => {
        // Download all Pokémon into localStorage for offline use

        this.setState({
            downloading: true
        });

        this.worker.postMessage({
            message: 'downloadAll',
            lang: this.state.language
        });
    }
	
	render() {
        const profile = (
            <div className="pokeprofile">
                <PokeProfile loading={this.state.profileLoading} pokemon={this.state.selectedPokemon} selectPokemon={this.selectPokemon} language={this.state.language}/>
            </div>
        );

        const downloadButton = (
            <button className="download-all-button" onClick={this.downloadAll} title={Languages.getLocalizedText(this.state.language, 'downloadAllHint')}>{Languages.getLocalizedText(this.state.language, 'downloadAll')}</button>
        );

        const downloadStatus = (
            <div className="download-all-status">
                {Languages.getLocalizedText(this.state.language, 'downloading')} {this.state.downloadId} / {this.state.downloadTotal}
            </div>
        );

		return (
			<div className="App">
				<div className="heading">
					<h1 className="title">Pokédex</h1>
                    {this.dropdown()}
                    <label className="lang-text" htmlFor="language">{Languages.getLocalizedText(this.state.language, 'language')}</label>
                    {this.state.downloading ? downloadStatus : downloadButton}
				</div>
				{profile}
				<div className="pokelist">
					<PokeList selectPokemon={this.selectPokemon} language={this.state.language} pokemon={this.state.selectedPokemon} list={this.state.list} loading={this.state.listLoading}/>
				</div>
			</div>
		);
	}
}
	
export default App;
	