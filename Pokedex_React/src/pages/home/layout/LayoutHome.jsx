import { useEffect } from "react";
import Header from "../header/Header";
import css from '../layout/layout.module.scss';
import axios from 'axios';
import { URL_POKEMON } from "../../../api/apiRest";

export default function LayoutHome() {

    useEffect(() => {
        // Función para obtener los datos de la API
        const fetchPokemonData = async () => {
            try {
                const response = await axios.get(URL_POKEMON);
                console.log(response.data); // Puedes manejar los datos aquí
            } catch (error) {
                console.error("Error al obtener los datos de la API:", error);
            }
        };

        fetchPokemonData();
    }, []); // Dependencias vacías para ejecutar solo una vez al montar el componente

    return (
        <div className={css.layout}>
            <Header />
        </div>
    );
}
