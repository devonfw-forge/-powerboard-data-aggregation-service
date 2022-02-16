import { Group } from '../models/group';
import { IValidationService } from './validations.service.interface';
import * as defaults from '../../shared/constants/constants';

export class ValidationService implements IValidationService {
  validateJira(data: Group[]): Boolean {
    for (let group of data) {
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === defaults.id) {
          this.isNotNull(object.value);
          let result = this.isNumber(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.startDate) {
          this.isNotNull(object.value);
          let result = this.isString(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.state) {
          this.isNotNull(object.value);
          let result = this.isString(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.endDate) {
          this.isNotNull(object.value);
          let result = this.isString(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.workUnit) {
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

  validateSonar(data: Group[]): Boolean {
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
        if (actualKey === defaults.codeSmells) {
          this.isNotNull(object.value);
          let result = this.isNumber(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.codeCoverage) {
          this.isNotNull(object.value);
          let result = this.isNumber(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.qualityGateStatus) {
          this.isNotNull(object.value);
          let result = this.isString(object.value);
          this.checkError(result);
        }
        if (actualKey === defaults.analysisDate) {
          this.isNotNull(object.value);
          let result = this.isString(object.value);
          this.checkError(result);
        }
      }
    }
    return true;
  }

  private isNotNull(value: any): any {
    if (!value) {
      this.checkError(false);
    }
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

  private checkError(value: Boolean): any {
    if (!value) {
      throw new Error('Exception Occured');
    }
  }
}
