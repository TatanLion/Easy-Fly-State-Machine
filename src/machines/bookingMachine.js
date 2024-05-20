import { assign, createMachine, fromPromise } from "xstate";
import { fetchCountries } from "../api/countries";

// VERSION 1 -> SIN ACCIONES
// const bookingMachine = createMachine({
//   id: "buy plane tickets",
//   initial: "initial",
//   states: {
//     initial: {
//       on: {
//         START: "search",
//       },
//     },
//     search: {
//       on: {
//         CONTINUE: "passengers",
//         CANCEL: "initial",
//       },
//     },
//     tickets: {
//       on: {
//         FINISH: "initial",
//       },
//     },
//     passengers: {
//       on: {
//         DONE: "tickets",
//         CANCEL: "initial",
//       },
//     },
//   },
// });

// VERSION 2 -> CON ACCIONES

const fillCountries = {
  initial: "loading",
  states: {
    loading: {
      invoke: { // Esta palabra reservada se usa para invocar un servicio
        id: "getCountries",
        src: fromPromise(() => fetchCountries()), // Se usa el fromPromise propiedad de xState pata consultar API's
        onDone: {
          target: "success",
          actions: assign({ 
            countries: ({event}) => event.output 
          }),
        },
        onError: {
          target: "failure",
          actions: assign({ error: "Fallo el request" }),
        },
      },
    },
    success: {},
    failure: { on: { RETRY: { target: "loading" } } },
  },
};


const bookingMachine = createMachine(
  {
    id: "buy plane tickets",
    initial: "initial",
    context: {
      passengers: [],
      selectedCountry: "",
      countries: [],
      error: ''
    },
    states: {
      initial: {
        on: {
          START: {
            target: "search",
            actions: "imprimirInicio",
          },
        },
      },
      search: {
        entry: "imprimirEntrada",
        exit: "imprimirSalida",
        on: {
          CONTINUE: {
            target: "passengers",
            actions: assign({
              selectedCountry: ({ event }) => event.selectedCountry,
            }),
          },
          CANCEL: {
            target: "initial",
            actions: "cleanContext"
          }
        },
        // ...fillCountries // Le pasamos la maquina hijo
      },
      tickets: {
        after:{ // Agregamos una transición con delay
          3000: {
            target: 'initial',
            actions: 'cleanContext',
          }
        },
        on: {
          FINISH: {
            target: "initial",
            actions: 'cleanContext',
          },
        },
      },
      passengers: {
        on: {
          DONE: {
            target: "tickets",
            guard: "moreThanOnePassenger" // Condiciones para la transición
          },
          CANCEL: {
            target: "initial",
            actions: "cleanContext",
          },
          ADD: {
            target: "passengers",
            actions: assign({
              passengers: ({context, event}) => [...context.passengers, event.newPassenger] 
            }
            ),
          },
        },
      },
    },
  },
  {
    actions: {
      imprimirInicio: () => console.log("Imprimiendo desde el inicio"),
      imprimirEntrada: () =>
        console.log("Imprimiendo desde la entrada en Search"),
      imprimirSalida: () => console.log("Imprimiendo salida desde el search"),
      cleanContext: assign({
        passengers: () => [],
        selectedCountry: () => "",
        countries: () => [],
        error: () => ''
      }),
    },
    guards: { // Validador de la información
      moreThanOnePassenger: ({context}) => {
        return context.passengers.length > 0
      }
    }
  }
);

export default bookingMachine;
