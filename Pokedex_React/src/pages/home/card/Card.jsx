import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; 
import css from './card.module.scss';
import axios from 'axios';
import { URL_ESPECIES, URL_POKEMON } from '../../../api/apiRest';

export default function Card({ card }) {
    const [itemPokemon, setItemPokemon] = useState(null); // Datos básicos del Pokémon
    const [especiePokemon, setSpeciesData] = useState(null); // Datos de la especie del Pokémon
    const [error, setError] = useState(null); // Manejo de errores

    // Primer useEffect: Obtiene los datos básicos del Pokémon
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

    // Segundo useEffect: Obtiene los datos de la especie del Pokémon
    useEffect(() => {
        const fetchSpeciesData = async () => {
            try {
                const response = await axios.get(`${URL_ESPECIES}/${card.name}`);
                setSpeciesData(response.data);
            } catch (err) {
                setError("Error al cargar los datos de la especie");
                console.error(err);
            }
        };

        if (card?.name) {
            fetchSpeciesData();
        }
    }, [card]);

    if (error) {
        return <p>{error}</p>; // Mostramos un mensaje de error si ocurre
    }

    if (!itemPokemon || !especiePokemon) {
        return <p>Cargando...</p>; // Mostramos un estado de carga mientras esperamos los datos
    }

    //Me aseguro que el id del pokemon tenga 3 digitos

    let pokeId = itemPokemon?.id?.toString();

    if(pokeId.length === 1){
        pokeId = "00" + pokeId;
    } else if(pokeId.length === 2){
        pokeId = "0" + pokeId;
    }
    // cada tipo de Pokémon tiene un estilo único basado en su tipo
    return (
        <div className={css.card}>
            <img
                className={css.img_poke}
                src={itemPokemon.sprites?.other['official-artwork']?.front_default}
                alt={itemPokemon.name}
            />
            <div className={`bg-${especiePokemon?.color?.name} ${css.sub_card}`}>
                <strong className={css.id_card}>#{String(pokeId).padStart(3, '0')}</strong>
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
                    Habitat: {especiePokemon.habitat?.name || "Desconocido"}
                </h4>

                <div>
                    {itemPokemon?.stats?.map((sta, index) => {
                        return(
                            <h6 key={index}>
                                <span className={css.name}>{sta.stat.name} className={css.item_start}</span>
                                <progress value={sta.base_stat} max={110}>

                                </progress>
                                <span className={css.numero}>{sta.base_stat}</span>
                            </h6>
                        )
                    })}
                </div>
                <div className={css.div_type_color}>
                    {itemPokemon?.types?.map((ti, index) => {
                        return(
                            <h6 key={index} className={`color-${ti.type.name} ${css.color_type}`}>{" "}{ti.type.name}</h6>
                        ) 
                    })}
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

