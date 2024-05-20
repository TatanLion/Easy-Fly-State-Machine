# React Vite with XState

Este proyecto usa la líbreria xState la cual nos permite crear una maquina de estados, desde allí podemos generar la maquina y luego pegarla dentro del VsCode.

- Link documentación `https://xstate.js.org/docs/`

Esto se guardo en la ruta: `src/machines/bookingMachine.js`

## Propiedades de los estados

- **Value:**
  Indica el nombre del estado actual
  Cuando se tiene una máquina padre y esta tiene una máquina hija, este nombre del estado actual pasa de ser una cadena de texto a un objeto
  Dicho objeto dice el estado tanto de la máquina padre como la máquina hija

- **Context:**
  Da el contexto del estado actual
  Nos permite guardar valores (Objetos, arrays, etc.)
  Es un pedazo de la máquina donde se va guardando y actualizando los valores

- **Event:**
  El nombre del evento anterior que nos trajo al estado actual

- **Action:**
  Es un array que contiene las acciones que ejecutan algún estado
  Son funciones de ejecutar y olvidar

- **Activities (⚠️ Deprecated):**
  Listado de actividades indicando si están en progreso o no
  Las actividades a diferencia de las acciones (ejecutar y olvidar) son cosas más permanentes (Invocar un servicio, observable)

- **History:**
  Indica el estado anterior
  Se implementa cuando deseamos saber cuál fue el estado anterior en caso de condicionales

- **Meta:**
  Sección de metadata dentro del estado
  Nos permite poner valores asociados al estado, los cuales serán permanentes

- **NextEvents:**
  Es un array de los posibles eventos que podemos ejecutar a partir del estado actual
  Métodos de los estados

## Métodos de los estados

- **Matches(nombre del estado):**
  Pasando el nombre de un estado nos responde si dicho estado es el actual o no
  Nos ayuda a ver si estamos en un estado tanto de la máquina padre o hijo

- **Can(nombre del evento):**
  Pasando el nombre de un evento nos indica si podemos ejecutarlo

## Eventos y Transiciones

Una transición se ejecuta de la siguiente manera

`const yellowState = lightMachine.transition(greenState, { type: 'TIMER });`

Donde: greenState es el estado desde que inicia la transición
{ type: 'TIMER } es el evento que causa la transición

El evento y la transición no es lo mismo

- El evento es la acción que genera o ejecuta la transición
- La transición es el proceso de cambiar de un estado a otro

**Transiciones habilitadas:**
Son transiciones que van a ocurrir si las llamamos

**Transiciones Prohibidas:**
Son transiciones que no se pueden ejecutar
Porque no queremos que se ejecute dicha transición

**Wildcards:**
Es el operador de multiplicación (\*)
Indica que cualquier evento que se ejecute en el estado va a ser lo que diga dicho asterisco

**Transiciones sin eventos:**
Son transiciones intermedias con las cuales se puede realizar operaciones o transicionar a otros eventos

**Transiciones protegidas:**
Son aquellas transiciones las cuales transicionan a otros eventos mediante condicionales
Se puede definir si pasa a un estado o a otro
Se puede definir que dada una condicional no pasa al siguiente estado

**Transiciones atrasadas:**
Son transiciones que se ejecutan después de una cierta cantidad tiempo

## Acciones

Es una función que se ejecuta cuando estamos dentro de un estado, estas tienen la capacidad de que se llaman una sola vez y allí termina. Para esto en nuestra maquina de estados debemos cambiar la forma para dar a conocer las acciones.

Existen 3 tipos de acciones

**Entrada:**
Se usa con `entry` y se disparan cuando entramos a un estado, por ejemplo tenemos un select que contiene paises, puede ser una consulta a esa API para traer los paises.

```
search: {
    entry: 'imprimirEntrada',
    exit: 'imprimirSalida',
    on: {
        CONTINUE: "passengers",
        CANCEL: "initial",
    },
},
```

**Durante la transición:**
Se usa con `actions` llama en el medio de la transición cuando estamos ya dentro de un estado.

```
states: {
      initial: {
        on: {
          START: {
            target: "search",
            actions: "imprimirInicio",
          },
        },
    },
}
```

**Salida:**
Se usa con `exit` llama al salir de la transición de la salida, por ejemplo cuando tengamos un form podemos llamarlo y hacer que se guarde desde el backend en un endpoint y luego seguir

```
search: {
    entry: 'imprimirEntrada',
    exit: 'imprimirSalida',
    on: {
        CONTINUE: "passengers",
        CANCEL: "initial",
    },
},
```

Estas acciones se crean desde el actions, basado en el nombre que le hayamos puesto

```
{
    actions: {
      imprimirInicio: () => console.log('Imprimiendo desde el inicio'),
      imprimirEntrada: () => console.log('Imprimiendo desde la entrada en Search'),
      imprimirSalida: () => console.log('Imprimiendo salida desde el search'),
    }
}
```

## Contexto

Es una parte extendida de la máquina de estados. El contexto en general nos ayudará a guardar datos

```
context: {
  // Objeto de contexto
  passengers: [],
  selectedCountry: "",
},
```

## Jerarquías y máquinas paralelas

### Jerarquias

- Se puede crear varias máquinas a la vez y darles comunicación entre sí para poder crear flujos más complejos

- Las jerarquías dentro de las máquinas de estados, nos permiten tener máquinas hijas dentro de una máquina más grande

- Principalmente, podemos encontrar una jerarquía cuando una máquina de estados en un estado tendrá otra máquina de estados

### Máquinas paralelas

- Son dos máquinas, una máquina al lado de otra, pero lo que pasa en cada una no afecta a la otra

## Servicios

Es una función que se invocan para realizar cierto procedimiento. Dentro de los servicios tenemos diferentes categorías

- **Promesas ⇒** Se pueden utilizar para realizar request a API’s
- **Callbacks ⇒** Son servicios que se comunican entre el padre e hijo mediante un callback
- **Observables ⇒**  Son servicios que mandan un array de eventos, dichos eventos se suelen tener un comportamiento similiar a un eventListener
- **Invocar otras máquinas ⇒** Es un tipo de servicio que hace posible que una máquina padre invoca múltiples máquinas hijas

  - Se crea un puente entre ambas máquinas, que permite que el padre mediante la función send envíe eventos a sus hijos y a la vez los hijos puedan enviar eventos a sus padres con la función sendParent