import { Group } from '../models/group';
import { IValidationService } from './validations.service.interface';

export class ValidationService implements IValidationService {
  validateJira(data: Group[]): Boolean {
    if (this.isNotNull(data)) {
      return true;
    }
    if (this.isNumber(data)) {
      return true;
    }
    if (this.isString(data)) {
      return true;
    }
    return true;
  }

  private isNotNull(value: any): Boolean {
    if (!value) {
      return false;
    }
    return true;
  }

  private isString(value: any): Boolean {
    if (typeof value === 'string') {
      return true;
    }
    return false;
  }

  private isNumber(value: any): Boolean {
    if (typeof value === 'number') {
      return true;
    }
    return false;
  }
}
