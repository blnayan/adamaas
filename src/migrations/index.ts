import * as migration_20260101_221310_initial from './20260101_221310_initial';
import * as migration_20260105_194231_new_collection_inquiries from './20260105_194231_new_collection_inquiries';

export const migrations = [
  {
    up: migration_20260101_221310_initial.up,
    down: migration_20260101_221310_initial.down,
    name: '20260101_221310_initial',
  },
  {
    up: migration_20260105_194231_new_collection_inquiries.up,
    down: migration_20260105_194231_new_collection_inquiries.down,
    name: '20260105_194231_new_collection_inquiries'
  },
];
