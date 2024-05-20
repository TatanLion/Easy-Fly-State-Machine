import React from 'react';
import { useMachine } from '@xstate/react';
import { Nav } from '../components/Nav';
import { StepsLayout } from './StepsLayout';
import bookingMachine from '../machines/bookingMachine';
import './BaseLayout.css'

export const BaseLayout = () => {
  // Send es la función para ejecutar las transiciones y state para saber donde estamos actualmente
  const [state, send] = useMachine(bookingMachine);

  console.log('nuestra maquina', state.value, state.context);

  return (
    <div className='BaseLayout'>
      <Nav state={state} send={send} />
      <StepsLayout state={state} send={send} />
    </div>
  );
}