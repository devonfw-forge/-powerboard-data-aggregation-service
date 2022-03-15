import { Group } from '../models/group';

export interface IValidationService {
  validateJira(data: Group[]): boolean;
  validateSonar(data: Group[]): boolean;
  validateClientSatisfaction(data: Group[]): boolean;
}
