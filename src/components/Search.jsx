import React, { useState } from "react";
import "./Search.css";

export const Search = ({ state, send }) => {
  const [flight, setFlight] = useState("");

  const goToPassengers = () => {
    send({ type: "CONTINUE", selectedCountry: flight });
  };

  const handleSelectChange = (event) => {
    setFlight(event.target.value);
  };

  // const options = state.context.countries;

  const countries = ["Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba", "Dominica", "Ecuador", "El Salvador", "Guatemala", "Guyana", "Haití", "Honduras", "Jamaica", "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "República Dominicana", "Surinam", "Trinidad y Tobago", "Uruguay", "Venezuela"];

  return (
    <div className="Search">
      <p className="Search-title title">Busca tu destino</p>
      <select
        id="country"
        className="Search-select"
        value={flight}
        onChange={handleSelectChange}
      >
        <option value="" disabled defaultValue>
          Escoge un país
        </option>

        {/* DATOS QUEMADOS */}
        {countries.map(option => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}

        {/* CONSULTANDO API */}
        {/* {options.map((option) => (
          <option value={option.name.common} key={option.name.common}>{option.name.common}</option>)
        )} */}
      </select>
      <button
        onClick={goToPassengers}
        disabled={flight === ""}
        className="Search-continue button"
      >
        Continuar
      </button>
    </div>
  );
};
