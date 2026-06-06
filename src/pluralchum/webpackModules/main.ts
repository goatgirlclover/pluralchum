import { initializeProfileMap } from '@moonlight-mod/wp/pluralchum_data';
import { MapCell, ValueCell } from '@moonlight-mod/wp/pluralchum_utility';

const logger = moonlight.getLogger('pluralchum/main');

class Pluralchum {
  public profileMap: MapCell;
  public enabled: ValueCell;

  public start() {
    this.profileMap = initializeProfileMap();

    logger.info('Loaded PK data');

    this.enabled = new ValueCell(true);
  }
}

export default new Pluralchum();
