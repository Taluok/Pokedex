import { useEffect, useState } from "react";
import Header from "../header/Header";
import css from "../layout/layout.module.scss";
import axios from "axios";
import { URL_POKEMON } from "../../../api/apiRest";
import Card from "../card/Card";

export default function LayoutHome() {
    const [arrayPokemon, setArrayPokemon] = useState([]); // Estado para almacenar la lista de Pokémon
    const [xpage, setXpage] = useState(1); // Estado para almacenar la página actual

    useEffect(() => {
        // Función para obtener los datos de la API
        const fetchPokemonData = async () => {
            const limit = 15; // Límite de resultados a obtener
            const offset = (xpage - 1) * limit; // Cálculo del offset para la API

            try {
                const apiPoke = await axios.get(`${URL_POKEMON}/?offset=${offset}&limit=${limit}`); // Petición a la API
                setArrayPokemon(apiPoke.data.results || []); // Guardamos los resultados o un array vacío
            } catch (error) {
                console.error("Error al obtener los datos de la API:", error); // Manejo de errores
            }
        };

        fetchPokemonData();
    }, [xpage]); // El efecto se ejecuta cuando cambia `xpage`

    // Funciones para cambiar de página
    const nextPage = () => setXpage((prev) => prev + 1); // Ir a la siguiente página
    const prevPage = () => setXpage((prev) => (prev > 1 ? prev - 1 : prev)); // Ir a la página anterior, sin ir más atrás de la página 1

    return (
        <div className={css.layout}>
            <Header /> {/* Componente del encabezado */}


            {/* Contenedor de las tarjetas de Pokémon */}
            <div className={css.card_content}>
                {arrayPokemon.length > 0 ? (
                    arrayPokemon.map((card, index) => (
                        <Card key={index} card={card} /> // Renderizamos cada tarjeta
                    ))
                ) : (
                    <p>No se encontraron Pokémon</p> // Mensaje si no hay datos
                )}
            </div>

            {/* Controles de paginación */}
            <section className={css.pagination}>
                <button onClick={prevPage} disabled={xpage === 1}>
                    Anterior
                </button>
                <span>Página {xpage}</span>
                <button onClick={nextPage}>Siguiente</button>
            </section>
        </div>
    );
}

