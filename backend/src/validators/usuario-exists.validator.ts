import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class UsuarioExistsConstraint implements ValidatorConstraintInterface {
  async validate(usuarioId: number, args: ValidationArguments) {
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'El usuario no existe';
  }
}

export function UsuarioExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UsuarioExistsConstraint,
    });
  };
}