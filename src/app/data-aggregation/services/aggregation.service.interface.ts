export interface IDataAggregationService {
  initializeAndStartTeamSpiritScheduler(teamId: string): any;
  reInitializeAndRestartTeamSpiritScheduler(teamId: string): any;
  checkTeamSpiritTeamName(teamName:string): Promise<any>;
}
