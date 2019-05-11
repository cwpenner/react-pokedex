import React, { Component } from 'react';
import './PokeProfileEvoItem.css';
import Utilities from '../../Utilities/Utilities';

class PokeProfileEvoItem extends Component {
    // Displays the name and image of a Pokémon in the evolution chain

    pokemonClicked = () => {
        this.props.selectPokemon(this.props.pokemon.number);
    }
    
    render() {
        const pokemon = this.props.pokemon;
        const altText = 'Front image of ' + pokemon.name;
        const imageSource = pokemon.images.front_default;

        return (
            <div className="pokeprofile-evo-item" onClick={this.pokemonClicked}>
                <div className={`pokeprofile-evo-image ${this.props.active && "pokeprofile-evo-image-active"}`}>
                    <img src={imageSource} alt={altText}/>
                </div>
                <div className={`pokeprofile-evo-name ${this.props.active && "pokeprofile-evo-name-active"}`}>
                    {Utilities.toTitleCase(pokemon.name)}
                </div>
            </div>
        );
    }
}

export default PokeProfileEvoItem;