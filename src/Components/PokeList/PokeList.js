import React, { Component } from 'react';
import './PokeList.css';
import PokeListItem from './PokeListItem';
import Loader from '../../Utilities/Loader/Loader';

class PokeList extends Component {
    // Displays a list of Pokémon fetched using the PokéAPI
    
    selectPokemon = (id) => {
        this.props.selectPokemon(id);
    }

    render() {
        const list = (
            this.props.list.map(pokemon => {
                return (
                    <PokeListItem 
                        key={pokemon.entry_number}
                        name={pokemon.pokemon_species.name}
                        number={pokemon.entry_number}
                        selectPokemon={this.selectPokemon}
                        active={this.props.pokemon.number === pokemon.entry_number}
                    />
                );
            })
        );

        return (
            <div className="pokelist-main">
                { this.props.loading ? <Loader/> : list }
            </div>
        );
    }
}

export default PokeList;