function createJson(result, message){
  return {
    result: result,
    message: message,
    type:    result ? 'Éxito' : 'Error'
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
      false: 'Las contraseñas no coinciden ' +
              `${processVal(val1, show)} ` +
              `no es igual a ${processVal(val2)}`
    }
  );
}

function notNull(val, name){
  name = i18nEsMx()[name];
  return evalue(
    val !== '',
    {
      true:  `El campo ${name} sí contiene información`,
      false: `El campo ${name} debe contener información mínima`
    }
  );
}

function size(size, min) {
  return evalue(
    size > min,
    {
      true:  'Sí tiene el mínimo requerido',
      false: `El mínimo son ${min} caracteres`
    }
  );
}

function thisOrThat(thisSelector, thatSelector){
  let thisName = i18nEsMx()[thisSelector.replace('#', '')],
      thatName = i18nEsMx()[thatSelector.replace('#', '')];

  return evalue(
    $(thisSelector).val() !== '' || $(thatSelector).val() !== '',
    {
      true:  `Sí tiene ${thisName} o ${thatName}`,
      false: `Favor de llenar ${thisName} o ${thatName}`
    }
  );
}
