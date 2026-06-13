import { initializeProfileMap, purgeOldProfiles } from './data';
import { MapCell, ValueCell } from './utility';
import { patchEditMenuItem } from './edit';
import { upgradeCache } from './update';

const logger = moonlight.getLogger('pluralchum/main');

class Pluralchum {
  public profileMap: MapCell;
  public enabled: ValueCell;

  public start() {
    this.profileMap = initializeProfileMap();
    purgeOldProfiles(this.profileMap);
    logger.info('Loaded PK data');

    upgradeCache();
    logger.info('Cache upgraded');

    this.enabled = new ValueCell(true);

    patchEditMenuItem();
  }
}

export default new Pluralchum();
