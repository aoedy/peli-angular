import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function primeraLetraMayuscula(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = <string>control.value;

    if (!valor) return null;
    if (valor.length === 0) return null;

    const primeraLatra = valor[0];

    if (primeraLatra !== primeraLatra.toUpperCase()) {
      return {
        primeraLetraMayuscula: {
          mensaje: 'La primera letra debe ser mayúscula',
        },
      };
    }

    return null;
  };
}

export function fechaNoPuedeSerFutura(): ValidatorFn {
  return (Control: AbstractControl): ValidationErrors | null => {
    const fechaEscogidaPorElUsuario = new Date(Control.value);
    const hoy = new Date();

    if (fechaEscogidaPorElUsuario > hoy) {
      return {
        futuro: {
          mensaje: 'La fecha no puede ser del futuro',
        },
      };
    }
    return null;
  };
}
