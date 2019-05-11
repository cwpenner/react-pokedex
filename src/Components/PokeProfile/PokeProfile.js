import React, { Component } from 'react';
import './PokeProfile.css';
import Utilities from '../../Utilities/Utilities';
import Loader from '../../Utilities/Loader/Loader';
import PokeProfileEvoItem from './PokeProfileEvoItem';

class PokeProfile extends Component {
    // Displays profile information for the selected Pokémon, including:
    // Name, description, image, evolution chain, habitat, and stats
    constructor() {
        super();
        this.state = {
            selectedImage: 'front_default'
        };
    }

    getHeader(pokemon) {
        if (pokemon) {
            return (
                <div className="pokeprofile-header">
                    <div className="pokeprofile-id">
                        <div className="pokeprofile-text">
                            {pokemon.number}
                        </div>
                    </div>
                    <div className="pokeprofile-name">
                        {pokemon.name}
                    </div>
                    <div className="pokeprofile-description">
                        {pokemon.description}
                    </div>
                </div>
            );
        }
    }

    getTypes(pokemonTypes) {
        let types = '';
        
        if (pokemonTypes) {
            for (let i = 0; i < pokemonTypes.length; i++) {
                types += pokemonTypes[i];
    
                if (i + 1 < pokemonTypes.length) {
                    types += ', ';
                }
            }
        }

        return types;
    }

    getCharacteristics(pokemon) {
        if (pokemon) {
            return (
                <div className="pokeprofile-characteristics">
                    <h2>Characteristics</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>Height:</td><td>{pokemon.height} m</td>
                            </tr>
                            <tr>
                                <td>Weight:</td><td>{pokemon.weight} kg</td>
                            </tr>
                            <tr>
                                <td>Types:</td><td>{this.getTypes(pokemon.types)}</td>
                            </tr>
                            <tr>
                                <td>Habitat:</td><td>{Utilities.toTitleCase(pokemon.habitat)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    getStats(pokemonStats) {
        if (pokemonStats) {
            return (
                <div className="pokeprofile-stats">
                    <h2>Stats</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>HP:</td><td>{pokemonStats.hp}</td>
                            </tr>
                            <tr>
                                <td>Attack:</td><td>{pokemonStats.attack}</td>
                            </tr>
                            <tr>
                                <td>Defense:</td><td>{pokemonStats.defense}</td>
                            </tr>
                            <tr>
                                <td>Special Attack:</td><td>{pokemonStats.specialAttack}</td>
                            </tr>
                            <tr>
                                <td>Special Defense:</td><td>{pokemonStats.specialDefense}</td>
                            </tr>
                            <tr>
                                <td>Speed:</td><td>{pokemonStats.speed}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    imageSelector(pokemonImages) {
        if (pokemonImages) {
            const images = [];
            Object.keys(pokemonImages).forEach(key => {
                images.push(key);
            });
            return (
                <select id="images" name="image-selector" className="image-selector" value={this.state.selectedImage} onChange={this.handleChange}>                
                    {images.map(image => {
                        return <option key={image} value={image}>{Utilities.normalizeText(image)}</option>
                    })}
                </select>
            );
        }
    }

    handleChange = (event) => {
        const {value} = event.target;

		this.setState({
			selectedImage: value
        });
	}

    getImages(pokemonImages) {
        if (pokemonImages) {
            const altText = Utilities.normalizeText(this.state.selectedImage) + ' image of ' + this.props.pokemon.name;
            const imageSource = pokemonImages[this.state.selectedImage];
            return (
                <div className="pokeprofile-image-component">
                    <div className="pokeprofile-image">
                        <img src={imageSource} alt={altText}/> 
                    </div>
                    {this.imageSelector(pokemonImages)}
                    <label htmlFor="images">Image Selector</label>
                </div>
            );
        }
    }

    getEvoItem(pokemon) {
        const evoList = [];

        if (pokemon && pokemon.evoChain) {
            for (let i = 0; i < pokemon.evoChain.length; i++) {
                const evoPokemon = pokemon.evoChain[i];
                evoList.push(<PokeProfileEvoItem key={evoPokemon.number} pokemon={evoPokemon} active={pokemon.number === evoPokemon.number} selectPokemon={this.props.selectPokemon}/>)
                
                if (i + 1 < pokemon.evoChain.length) {
                    evoList.push(<i key={evoPokemon.number + 'a'} className="fas fa-chevron-right evo-arrow"></i>);
                }
            }
        }

        return evoList;
    }

    getEvoChain(pokemon) {
        if (pokemon && pokemon.evoChain) {
            return (
                <div className="pokeprofile-evochain">
                    <h1>Evolution Chain</h1>
                    <div className="pokeprofile-evochain-container">
                        {this.getEvoItem(pokemon)}
                    </div>
                </div>
            );
        }
    }

    selectPokemon = (id) => {
        this.props.selectPokemon(id);
    }

    render() {
        const pokemon = this.props.pokemon;

        const profile = (
            <div className="pokeprofile-container">
                {this.getHeader(pokemon)}
                {this.getImages(pokemon.images)}
                {this.getCharacteristics(pokemon)}
                {this.getStats(pokemon.stats)}
                {this.getEvoChain(pokemon)}
            </div>
        );
        
        return (
            <div className="pokeprofile-main">
                { this.props.loading ? <Loader/> : profile }
            </div>
        );
    }
}

export default PokeProfile;