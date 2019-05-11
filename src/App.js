import React from 'react';
import './App.css';
import PokeProfile from './Components/PokeProfile/PokeProfile';
import PokeList from './Components/PokeList/PokeList';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
            loading: true,
            language: 'en',
            languages: [],
            selectedPokemonId: 25,
            selectedPokemon: {}
        };
	}

	componentDidMount() {
        let lang = localStorage.getItem('lang');

        if (lang) {
            this.setState({ language: lang });
        } else {
            lang = this.state.language;
        }

        this.getLanguages();
        this.getPokemonInfo(this.state.selectedPokemonId, lang);
    }

    handleChange = (event) => {
        const {name, value} = event.target;

		this.setState({
			[name]: value
        });
        localStorage.setItem('lang', value);
        this.getPokemonInfo(this.state.selectedPokemonId, value);
	}

    async getPokemonInfo(id, lang) {
        this.setState({ loading: true });
        
        const response = await fetch('/pokemon/view?id=' + id + '&lang=' + lang);
        const data = await response.json();
        console.log('Pokedata', data);

        if (data) {
            this.setState({
                selectedPokemon: data
            });
        }

        this.setState({ loading: false });
    }
    
    selectPokemon = (id) => {
        this.setState({ selectedPokemonId: id });
        this.getPokemonInfo(id, this.state.language); //TODO: provide way to change language and store language in local storage
    }

    async getLanguages() {
        const response = await fetch('/pokemon/getLanguages');
        const data = await response.json();
        console.log('Language data', data);

        if (data && data.results) {
            const languages = [];
            data.results.forEach(lang => {
                languages.push(lang.name);
            });
            this.setState({ languages: languages });
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
	
	render() {
		return (
			<div className="App">
				<div className="heading">
					<h1 className="title">Pokédex</h1>
                    {this.dropdown()}
                    <label className="lang-text" htmlFor="language">Language</label>
				</div>
				<div className="pokeprofile">
                    <PokeProfile loading={this.state.loading} pokemon={this.state.selectedPokemon} selectPokemon={this.selectPokemon}/>
				</div>
				<div className="pokelist">
					<PokeList selectPokemon={this.selectPokemon} language={this.state.language}/>
				</div>
			</div>
		);
	}
}
	
export default App;
	