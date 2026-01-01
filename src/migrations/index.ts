import * as migration_20260101_221310_initial from './20260101_221310_initial';

export const migrations = [
  {
    up: migration_20260101_221310_initial.up,
    down: migration_20260101_221310_initial.down,
    name: '20260101_221310_initial'
  },
];
