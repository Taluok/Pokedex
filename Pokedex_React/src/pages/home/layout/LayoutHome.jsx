import { useEffect, useState } from "react";
import Header from "../header/Header";
import css from "../layout/layout.module.scss";
import axios from "axios";
import { URL_POKEMON } from "../../../api/apiRest";
import Card from "../card/Card";

export default function LayoutHome() {
    const [arrayPokemon, setArrayPokemon] = useState([]); // Lista de Pokémon
    const [xpage, setXpage] = useState(1); // Página actual
    const [search, setSearch] = useState(""); // Texto de búsqueda

    useEffect(() => {
        const fetchPokemonData = async () => {
            const limit = 15; // Límite de resultados por página
            const offset = (xpage - 1) * limit; // Offset calculado

            try {
                const apiPoke = await axios.get(`${URL_POKEMON}/?offset=${offset}&limit=${limit}`);
                setArrayPokemon(apiPoke.data.results || []); // Guardamos los resultados o un array vacío
            } catch (error) {
                console.error("Error al obtener los datos de la API:", error);
            }
        };

        fetchPokemonData();
    }, [xpage]); // Efecto dependiente de `xpage`

    // Función para manejar el texto de búsqueda
    const obtenerSearch = (e) => {
        const texto = e.toLowerCase(); // Convertimos a minúsculas
        setSearch(texto);
        setXpage(1); // Reiniciamos a la página 1 al buscar
    };

    // Filtramos los Pokémon según el texto de búsqueda
    const filteredPokemons = search
        ? arrayPokemon.filter((pokemon) => pokemon.name.toLowerCase().includes(search))
        : arrayPokemon;

    // Funciones para cambiar de página
    const nextPage = () => setXpage((prev) => prev + 1);
    const prevPage = () => setXpage((prev) => (prev > 1 ? prev - 1 : prev));

    return (
        <div className={css.layout}>
            <Header obtenerSearch={obtenerSearch} /> {/* Componente del encabezado con búsqueda */}

            {/* Contenedor de las tarjetas de Pokémon */}
            <div className={css.card_content}>
                {filteredPokemons.length > 0 ? (
                    filteredPokemons.map((card, index) => (
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

            <div className={css.card_content}>
                {filteredPokemons.map((card, index) => {
                    return <Card key={index} card={card} />;
                })}
            </div>
        </div>
    );
}

