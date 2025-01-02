import { useEffect, useState } from 'react'; 
import css from './card.module.scss';
import axios from 'axios';
import { URL_POKEMON } from '../../../api/apiRest';

export default function Card({ card }) {
    const [itemPokemon, setItemPokemon] = useState(null); // Inicializamos con null para verificar el estado
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const fetchPokemonData = async () => {
            try {
                const response = await axios.get(`${URL_POKEMON}/${card.name}`);
                setItemPokemon(response.data); // Guardamos los datos del Pokémon
            } catch (err) {
                setError("Error al cargar los datos del Pokémon"); // Manejo de errores
                console.error(err);
            }
        };

        if (card.name) { // Verificamos que card y name existan
            fetchPokemonData();
        }
    }, [card]); // Agregamos card como dependencia

    if (error) {
        return <p>{error}</p>; // Mostramos un mensaje de error si ocurre
    }

    if (!itemPokemon) {
        return <p>Cargando...</p>; // Mostramos un estado de carga mientras esperamos los datos
    }

    return (
        <div className={css.card}>
            <img
                src={itemPokemon?.sprites?.other['official-artwork']?.front_default} alt={itemPokemon.name}/>
            <div className={css.sub_card}>
                <strong className={css.id_card}> 011 </strong>
                <strong className={css.name_card}> name </strong>
                <h4 className={css.altura_poke}>10cm</h4>
                <h4 className={css.peso_poke}>Peso</h4>
                <h4 className={css.habilidad.poke}>Habilidad</h4>
            </div>
        </div>
    );
}
