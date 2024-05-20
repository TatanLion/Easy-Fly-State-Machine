import React from 'react';
import './Nav.css';

export const Nav = ({ state, send }) => {
  const goToWelcome = () => {
    send({
      type: 'CANCEL'
    })
  }

  return (
    <nav className='Nav'>
      <h1 className='Nav-logo'>Easy fly ✈</h1>
      {!state.matches('initial') && !state.matches('tickets') &&
        <button onClick={goToWelcome} className='Nav-cancel button-secondary'>Cancelar</button>
      }
    </nav>
  );
}; 