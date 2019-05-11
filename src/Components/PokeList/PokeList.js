import React, { Component } from 'react';
import './PokeList.css';
import PokeListItem from './PokeListItem';
import Loader from '../../Utilities/Loader/Loader';

class PokeList extends Component {
    // Displays a list of Pokémon fetched using the PokéAPI

    constructor() {
        super();
        this.state = {
            loading: true,
            list: [],
            active: 25
        };
    }

    componentDidMount() {
        this.getPokedexInfo();
    }

    async getPokedexInfo() {
        this.setState({ loading: true });
        
        const response = await fetch('/pokemon/list?lang=' + this.props.language);
        const data = await response.json();
        console.log('Pokelist data', data);

        if (data) {
            if (data.pokemon_entries) {
                this.setState({
                    list: data.pokemon_entries
                });
            }
        }

        this.setState({ loading: false });
    }
    
    selectPokemon = (id) => {
        this.setState({ active: id });
        this.props.selectPokemon(id);
    }

    render() {
        const list = (
            this.state.list.map(pokemon => {
                return (
                    <PokeListItem 
                        key={pokemon.entry_number}
                        name={pokemon.pokemon_species.name}
                        number={pokemon.entry_number}
                        selectPokemon={this.selectPokemon}
                        active={this.state.active === pokemon.entry_number}
                    />
                );
            })
        );

        return (
            <div className="pokelist-main">
                { this.state.loading ? <Loader/> : list }
            </div>
        );
    }
}

export default PokeList;