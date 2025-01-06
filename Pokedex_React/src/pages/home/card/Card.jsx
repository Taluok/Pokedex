import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; 
import css from './card.module.scss';
import axios from 'axios';
import { URL_ESPECIES, URL_POKEMON } from '../../../api/apiRest';

export default function Card({ card }) {
    const [itemPokemon, setItemPokemon] = useState(null); // Datos básicos del Pokémon
    const [especiePokemon, setEspeciePokemon] = useState(null); // Datos de la especie del Pokémon
    const [evoluciones, setEvoluciones] = useState([]); // Lista de evoluciones
    const [error, setError] = useState(null); // Manejo de errores

    // Obtener datos básicos del Pokémon
    useEffect(() => {
        const fetchPokemonData = async () => {
            try {
                const response = await axios.get(`${URL_POKEMON}/${card.name}`);
                setItemPokemon(response.data);
            } catch (err) {
                setError("Error al cargar los datos del Pokémon");
                console.error(err);
            }
        };

        if (card?.name) {
            fetchPokemonData();
        }
    }, [card]);

    // Obtener datos de la especie del Pokémon y su cadena de evolución
    useEffect(() => {
        const fetchSpeciesAndEvolution = async () => {
            try {
                // Obtener datos de la especie
                const responseSpecies = await axios.get(`${URL_ESPECIES}/${card.name}`);
                setEspeciePokemon(responseSpecies.data);

                // Obtener datos de la cadena de evolución
                const evolutionChainUrl = responseSpecies.data?.evolution_chain?.url;
                if (evolutionChainUrl) {
                    const responseEvolution = await axios.get(evolutionChainUrl);
                    const chain = responseEvolution.data?.chain;

                    // Procesar la cadena de evolución
                    const evolutionsArray = [];
                    let currentEvolution = chain;

                    while (currentEvolution) {
                        const pokemonName = currentEvolution.species.name;
                        const id = currentEvolution.species.url.split('/').slice(-2, -1)[0];

                        // Obtener imagen del Pokémon
                        const imageResponse = await axios.get(`${URL_POKEMON}/${id}`);
                        const image = imageResponse.data?.sprites?.other['official-artwork']?.front_default;

                        evolutionsArray.push({ name: pokemonName, id, image });
                        currentEvolution = currentEvolution.evolves_to[0]; // Siguiente evolución
                    }

                    setEvoluciones(evolutionsArray);
                }
            } catch (err) {
                setError("Error al cargar los datos de la especie o evolución");
                console.error(err);
            }
        };

        if (card?.name) {
            fetchSpeciesAndEvolution();
        }
    }, [card]);

    if (error) {
        return <p>{error}</p>; // Mostrar mensaje de error
    }

    if (!itemPokemon || !especiePokemon) {
        return <p>Cargando...</p>; // Mostrar estado de carga
    }

    // Asegurar que el ID del Pokémon tenga 3 dígitos
    const formatPokeId = (id) => id.toString().padStart(3, '0');
    const pokeId = formatPokeId(itemPokemon.id);

    return (
        <div className={css.card}>
            <img
                className={css.img_poke}
                src={itemPokemon.sprites?.other['official-artwork']?.front_default}
                alt={itemPokemon.name}
            />
            <div className={`bg-${especiePokemon.color?.name} ${css.sub_card}`}>
                <strong className={css.id_card}>#{pokeId}</strong>
                <br />
                <strong className={css.name_card}>{itemPokemon.name}</strong>
                <h4 className={css.altura_poke}>Altura: {itemPokemon.height / 10} m</h4>
                <h4 className={css.peso_poke}>Peso: {itemPokemon.weight / 10} kg</h4>
                <h4 className={css.habilidad_poke}>
                    Habilidad: {itemPokemon.abilities[0]?.ability?.name || "Desconocida"}
                </h4>
                <h4 className={css.species}>
                    Color: {especiePokemon.color?.name || "Desconocido"}
                </h4>
                <h4 className={css.species}>
                    Hábitat: {especiePokemon.habitat?.name || "Desconocido"}
                </h4>

                {/* Estadísticas */}
                <div>
                    {itemPokemon?.stats?.map((stat, index) => (
                        <h6 key={index}>
                            <span className={css.name}>{stat.stat.name}</span>
                            <progress value={stat.base_stat} max={110}></progress>
                            <span className={css.numero}>{stat.base_stat}</span>
                        </h6>
                    ))}
                </div>

                {/* Tipos */}
                <div className={css.div_type_color}>
                    {itemPokemon?.types?.map((type, index) => (
                        <h6 key={index} className={`color-${type.type.name} ${css.color_type}`}>
                            {type.type.name}
                        </h6>
                    ))}
                </div>

                {/* Evoluciones */}
                <div>
                    <h4>Evoluciones:</h4>
                    {evoluciones.map((evo) => (
                        <div key={evo.id}>
                            <img src={evo.image} alt={evo.name} />
                            <p>{evo.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Validación de las props
Card.propTypes = {
    card: PropTypes.shape({
        name: PropTypes.string.isRequired, // card debe tener una propiedad name de tipo string y es requerida
    }).isRequired,
};

