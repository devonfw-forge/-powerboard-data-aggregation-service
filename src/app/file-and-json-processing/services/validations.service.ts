import { Group } from '../models/group';
import { IValidationService } from './validations.service.interface';
import * as defaults from '../../shared/constants/constants';

export class ValidationService implements IValidationService {
  /**
   * It will validate processed jira data.
   * This will check whether all the property value is expected data type or not.
   */
  validateJira(data: Group[]): boolean {
    for (let group of data) {
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === defaults.sprint_number) {
          this.isNotNull(object.value);
          let result = this.isNumber(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.start_date) {
          this.isNotNull(object.value);
          let result = this.isString(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.state) {
          this.isNotNull(object.value);
          let result = this.isString(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.end_date) {
          this.isNotNull(object.value);
          let result = this.isString(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.work_unit) {
          this.isNotNull(object.value);
          let result = this.isString(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.value) {
          this.isNotNull(object.value);
          let result = this.isString(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.metric) {
          this.isNotNull(object.value);
          let result = this.isString(object.value);
          this.checkError(result);
        }
      }
    }
    return true;
  }

  /**
   * It will validate processed client satisfaction data.
   * This will check whether all the property value is expected data type or not.
   */
  validateClientSatisfaction(data: Group[]): boolean {
    for (let group of data) {
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === defaults.client_rating) {
          this.isNotNull(object.value);
          let result = this.isNumber(object.value);
          this.checkError(result);
        }
      }
    }
    return true;
  }

  /**
   * It will validate processed sonar data.
   * This will check whether all the property value is expected data type or not.
   */
  validateSonar(data: Group[]): boolean {
    for (let group of data) {
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === defaults.bugs) {
          this.isNotNull(object.value);
          let result = this.isNumber(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.code_smell) {
          this.isNotNull(object.value);
          let result = this.isNumber(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.code_coverage) {
          this.isNotNull(object.value);
          let result = this.isNumber(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.status) {
          this.isNotNull(object.value);
          let result = this.isString(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.snapshot_time) {
          this.isNotNull(object.value);
          let result = this.isString(object.value);
          this.checkError(result);
        }
      }
    }
    return true;
  }

  /**
   * It will check is value is null or not,
   * if value is null then call checkError method to throw an error.
   */
  private isNotNull(value: any): any {
    if (!value) {
      this.checkError(false);
    }
  }

  /**
   * It will check whether the value is string or not.
   */
  private isString(value: any): boolean {
    if (typeof value === 'string') {
      return true;
    }
    return false;
  }

  /**
   * It will check whether the value is number or not.
   */
  private isNumber(value: any): boolean {
    if (typeof value === 'number') {
      return true;
    }
    return false;
  }

  /**
   * It will throw an error is value is null.
   */
  private checkError(value: boolean): any {
    if (!value) {
      throw new Error('Exception Occured');
    }
  }
}
