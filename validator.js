function createJson(result, message){
  return {
    result: result,
    message: message,
    type:    result ? 'Success' : 'Error'
  };
}

function evalue(result, messages){
  return createJson(
    result, messages[result]
  );
}

function processVal(val, show){
  return show ? val : '*****';
}

function equals(val1, val2, show = true) {
  return evalue(
    val1 === val2,
    {
      true:  'Valores iguales',
      false: 'Error de comparacion ' +
              `${processVal(val1, show)} ` +
              `no es igual a ${processVal(val2)}`
    }
  );
}

function notNull(val, name){
  return evalue(
    val !== '',
    {
      true:  'El valor si contiene informacion',
      false: `El ${name} debe contener informacion minima`
    }
  );
}

function size(size, min) {
  return evalue(
    size > min,
    {
      true:  'Si tiene el minimo requerido',
      false: `La longuitud de la cadena no es la minima ${min} requerida`
    }
  );
}
