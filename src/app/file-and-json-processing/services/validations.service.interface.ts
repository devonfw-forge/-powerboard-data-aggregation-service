import { Group } from '../models/group';

export interface IValidationService {
  validateJira(data: Group[]): Boolean;
}
