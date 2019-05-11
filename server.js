const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');

const app = express();
const port = 5000;
const pokeAPIUrlBase = 'https://pokeapi.co/api/v2/';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper Methods
async function getEvolutionChain(evoChain, evoArray, lang) {
	const pokemon = await getFullPokemonInfoFromSpeciesUrl(evoChain.species.url, lang, false);
	evoArray.push(pokemon);

	if (evoChain.evolves_to.length === 0) {
		return evoArray;
	} else {
		const newEvoChain = evoChain.evolves_to[0];
		return await getEvolutionChain(newEvoChain, evoArray, lang);
	}
}

async function getFullPokemonInfoFromDetailsUrl(detailsUrl, lang, getEvoChain) {
	const detailsInfo = await getPokemonDetailsInfo(detailsUrl, lang);
	const speciesInfo = await getPokemonSpeciesInfo(detailsInfo.speciesUrl, lang, getEvoChain);
	const pokemon = {...detailsInfo, ...speciesInfo};

	return pokemon;
}

async function getFullPokemonInfoFromSpeciesUrl(speciesUrl, lang, getEvoChain) {
	const speciesInfo = await getPokemonSpeciesInfo(speciesUrl, lang, getEvoChain);
	const detailsInfo = await getPokemonDetailsInfo(speciesInfo.detailsUrl, lang);
	const pokemon = {...detailsInfo, ...speciesInfo};

	return pokemon;
}

async function getPokemonDetailsInfo(pokemonUrl, lang) {
	const pokemon = {
		number: 0,
		height: 0,
		weight: 0,
		types: [],
		images: {},
		stats: {},
		speciesUrl: ''
	};

	const detailsOptions = {
		uri: pokemonUrl,
		method: 'GET',
		json: true
	};
	const detailsData = await request.get(detailsOptions);
	
	if (!detailsData) {
		console.log('Error getting details of Pokémon');
		return pokemon;
	}

	pokemon.number = detailsData.id;
	pokemon.height = detailsData.height / 10; // Divide by 10 to convert from decimeters to meters
	pokemon.weight = detailsData.weight / 10; // Divide by 10 to get weight in kg
	pokemon.images = detailsData.sprites;

	// Process Stats
	for (const stat of detailsData.stats) {
		const statOptions = {
			uri: stat.stat.url,
			method: 'GET',
			json: true
		};
		const statData = await request.get(statOptions);

		if (!statData) {
			console.log('Error getting stat data of Pokémon');
		} else {
			statData.names.forEach(name => {
				if (name.language.name === lang) {
					const statName = name.name;
					switch (statName) {
						case "HP":
							pokemon.stats.hp = stat.base_stat;
							break;
						case "Attack":
							pokemon.stats.attack = stat.base_stat;
							break;
						case "Defense":
							pokemon.stats.defense = stat.base_stat;
							break;
						case "Special Attack":
							pokemon.stats.specialAttack = stat.base_stat;
							break;
						case "Special Defense":
							pokemon.stats.specialDefense = stat.base_stat;
							break;
						case "Speed":
							pokemon.stats.speed = stat.base_stat;
							break;
						default:
							console.log('Invalid stat', statName);
					}
				}
			});
		}
	}
	
	// Process Types
	for (const type of detailsData.types) {
		const typeOptions = {
			uri: type.type.url,
			method: 'GET',
			json: true
		};
		const typeData = await request.get(typeOptions);
		if (!typeData) {
			console.log('Error getting type data of Pokémon');
		} else {
			typeData.names.forEach(name => {
				if (name.language.name === lang) {
					pokemon.types.push(name.name);
				}
			});
		}
	}

	// Get Species URL
	pokemon.speciesUrl = detailsData.species.url;
	
	return pokemon;
}

async function getPokemonSpeciesInfo(speciesUrl, lang, getEvoChain) {
	// Get name, description, evochain, and habitat
	const pokemon = {
		name: '',
		habitat: '',
		description: '',
		evoChain: [],
		detailsUrl: ''
	};

	const speciesOptions = {
		uri: speciesUrl,
		method: 'GET',
		json: true
	};
	const speciesData = await request.get(speciesOptions);

	if (!speciesData) {
		console.log('Error getting species data of Pokémon');
		return pokemon;
	}

	// Process Name
	speciesData.names.forEach(name => {
		if (name.language.name === lang) {
			pokemon.name = name.name;
		}
	});

	// Process Descriptions
	speciesData.flavor_text_entries.forEach(desc => {
		if (desc.language.name === lang) {
			pokemon.description = desc.flavor_text; // For this purpose, I don't care which version the description is from
		}
	});

	// Process Habitat
	if (speciesData.habitat) {
		const habitatOptions = {
			uri: speciesData.habitat.url,
			method: 'GET',
			json: true
		};
		const habitatData = await request.get(habitatOptions);
	
		if (!habitatData) {
			console.log('Error getting habitat data of Pokémon');
		} else {
			habitatData.names.forEach(name => {
				if (name.language.name === lang) {
					pokemon.habitat = name.name;
				}
			});
		}
	}

	if (getEvoChain) {
		// Process Evolution Chain
		if (speciesData.evolution_chain && speciesData.evolution_chain.url) {
			const evoChainOptions = {
				uri: speciesData.evolution_chain.url,
				method: 'GET',
				json: true
			};
			const evoChainData = await request.get(evoChainOptions);
		
			if (!evoChainData) {
				console.log('Error getting evolution chain data of Pokémon');
			} else {
				const evoChainList = await getEvolutionChain(evoChainData.chain, [], lang);
				pokemon.evoChain = evoChainList;
			}
		}
	}

	// Get Details URL
	if (speciesData.varieties) {
		if (speciesData.varieties.length > 0) {
			pokemon.detailsUrl = speciesData.varieties[0].pokemon.url;
		}
	}

	return pokemon;
}

// Main Routing

app.get('/pokemon/getLanguages', async (req, res) => {
	try {
		const languagePokemonUrl = pokeAPIUrlBase + 'language';

		const languageOptions = {
			uri: languagePokemonUrl,
			method: 'GET',
			json: true
		};
		const languageData = await request.get(languageOptions);
		
		if (!languageData) {
			console.log('Error getting languages of Pokédex');
			res.send(null);
		} else {
			res.send(languageData);
		}
	} catch (e) {
		console.log('Error getting languages of Pokédex', e);
		res.send(null);
	}
});

app.get('/pokemon/list', async (req, res) => {
	try {
		const listPokemonUrl = pokeAPIUrlBase + 'pokedex/1';
		const lang = req.query.lang;
		//TODO: handle multiple languages

		const listOptions = {
			uri: listPokemonUrl,
			method: 'GET',
			json: true
		};
		const listData = await request.get(listOptions);
		
		if (!listData) {
			console.log('Error getting list of Pokémon');
			res.send(null);
		} else {
			res.send(listData);
		}
	} catch (e) {
		console.log('Error getting list of Pokémon', e);
		res.send(null);
	}
});

app.get('/pokemon/view', async (req, res) => {
	try {
		const viewPokemonDetailsUrl = pokeAPIUrlBase + 'pokemon/' + req.query.id;
		const lang = req.query.lang;

		const pokemon = await getFullPokemonInfoFromDetailsUrl(viewPokemonDetailsUrl, lang, true);

		if (!pokemon) {
			console.log('Error getting details of Pokémon');
		}

		res.send(pokemon);		
	} catch (e) {
		console.log('Error getting details of Pokémon', e);
		res.send(null);
	}
});

app.listen(port, () => console.log(`Listening on port ${port}`));