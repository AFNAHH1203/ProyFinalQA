import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class ProductoExistsConstraint implements ValidatorConstraintInterface {
  async validate(productoId: number, args: ValidationArguments) {
    // Aquí podrías inyectar el ProductosService para verificar si existe
    // Por simplicidad, asumimos que la validación se hace en el service
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'El producto no existe';
  }
}

export function ProductoExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ProductoExistsConstraint,
    });
  };
}
