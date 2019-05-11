import React from 'react';
import './App.css';
import PokeProfile from './Components/PokeProfile/PokeProfile';
import PokeList from './Components/PokeList/PokeList';
import worker from './Workers/worker';
import WebWorker from './Workers/WebWorker';
import Languages from './Utilities/Languages/Languages'

class App extends React.Component {
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
        // Create Background Worker
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

        this.getLanguages();
        this.getPokedexInfo(lang);
        this.getPokemonInfo(selectedPokemonId, lang);
    }

    handleChange = (event) => {
        const {name, value} = event.target;

		this.setState({
			[name]: value
        });
        localStorage.setItem('lang', value);

        this.getPokedexInfo(value);
        this.getPokemonInfo(this.state.selectedPokemonId, value);
    }
    
    async getPokedexInfo(lang) {
        this.setState({ listLoading: true });
        
        const list = localStorage.getItem('list-' + lang);

        if (list) {
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
                    localStorage.setItem('list-' + lang, JSON.stringify(data.pokemon_entries));
                    this.setState({ listLoading: false });
                }
            }
        } 
    }

    async getPokemonInfo(id, lang) {
        this.setState({ profileLoading: true });
        
        const pokemon = localStorage.getItem(id + '-' + lang);

        if (pokemon) {
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
                localStorage.setItem(data.number + '-' + lang, JSON.stringify(data));
            }
        }

        this.setState({ profileLoading: false });
    }
    
    selectPokemon = (id) => {
        this.setState({ selectedPokemonId: id });
        localStorage.setItem('selectedPokemonId', id);
        this.getPokemonInfo(id, this.state.language);
    }

    async getLanguages() {
        const langs = localStorage.getItem('languages');

        if (langs) {
            this.setState({ languages: JSON.parse(langs) });
        } else {
            const response = await fetch('/pokemon/getLanguages');
            const data = await response.json();
            console.log('Language data', data);
    
            if (data && data.results) {
                const languages = [];
                data.results.forEach(lang => {
                    if (Languages.supportedLanguages.includes(lang.name)) {
                        languages.push(lang.name);
                    }
                });
                this.setState({ languages: languages });
                localStorage.setItem('languages', JSON.stringify(languages));
            }
        }
    }

    dropdown() {
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
	