import { initializeProfileMap, purgeOldProfiles } from './data';
import { MapCell, ValueCell } from './utility';
import { patchMessageActions } from './MessageActions';
import { upgradeCache } from './update';
import { requireEula } from './eula';

const logger = moonlight.getLogger('pluralchumPlus/main');

class Pluralchum {
  public profileMap: MapCell;
  public enabled: ValueCell;

  public start() {
    this.profileMap = initializeProfileMap();
    purgeOldProfiles(this.profileMap);
    logger.info('Loaded PK data');

    upgradeCache();
    logger.info('Cache upgraded');

    requireEula();

    this.enabled = new ValueCell(true);

    patchMessageActions();
  }
}

export default new Pluralchum();
