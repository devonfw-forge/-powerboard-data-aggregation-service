export interface IDataAggregationService {
  initializeAndStartTeamSpiritScheduler(teamName: string): any;
  reInitializeAndRestartTeamSpiritScheduler(teamName: string): any;
}
