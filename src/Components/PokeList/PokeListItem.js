import React, { Component } from 'react';
import './PokeListItem.css';
import Utilites from '../../Utilities/Utilities';

class PokeListItem extends Component {
    // Displays the name and image of a Pokémon as a list item
    
    pokemonClicked = () => {
        // Sends the selected Pokémon to the parent
        
        this.props.selectPokemon(this.props.number);
    }
    
    render() {
        const pokemonName = Utilites.toTitleCase(this.props.name);
        const altText = 'Front image of ' + pokemonName;
        const imageSource = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this.props.number + '.png';

        return (
            <div className={`pokelist-item ${this.props.active && "pokelist-item-active"}`} onClick={this.pokemonClicked}>
                <span className="pokelist-image">
                    <img src={imageSource} alt={altText}/>
                </span>
                <span className={`pokelist-name ${this.props.active && "pokelist-name-active"}`}>
                    {pokemonName}
                </span>
            </div>
        );
    }
}

export default PokeListItem;