import { useEffect, useState } from "react";
import Header from "../header/Header";
import css from '../layout/layout.module.scss';
import axios from 'axios';
import { URL_POKEMON } from "../../../api/apiRest";
import Card from "../card/Card";

export default function LayoutHome() {
    const [arrayPokemon, setArrayPokemon] = useState([]); // Estado para almacenar la lista de Pokémon

    useEffect(() => {
        // Función para obtener los datos de la API
        const fetchPokemonData = async () => {
            try {
                const apiPoke = await axios.get(URL_POKEMON); // Petición a la API
                setArrayPokemon(apiPoke.data.results); // Guardamos los resultados
            } catch (error) {
                console.error("Error al obtener los datos de la API:", error); // Manejo de errores
            }
        };

        fetchPokemonData();
    }, []); // El efecto se ejecuta una vez al montar el componente

    return (
        <div className={css.layout}>
            <Header /> {/* Componente del encabezado */}
            
            {/* Contenedor de las tarjetas de Pokémon */}
            <div className={css.pokemonContainer}>
                {arrayPokemon.map((card, index) => (
                    <Card key={index} card={card} /> // Renderizamos cada tarjeta
                ))}
            </div>
        </div>
    );
}
