import * as migration_20260101_221310_initial from './20260101_221310_initial';
import * as migration_20260105_194231_new_collection_inquiries from './20260105_194231_new_collection_inquiries';
import * as migration_20260107_183303_inquiries_add_new_field_phone from './20260107_183303_inquiries_add_new_field_phone';

export const migrations = [
  {
    up: migration_20260101_221310_initial.up,
    down: migration_20260101_221310_initial.down,
    name: '20260101_221310_initial',
  },
  {
    up: migration_20260105_194231_new_collection_inquiries.up,
    down: migration_20260105_194231_new_collection_inquiries.down,
    name: '20260105_194231_new_collection_inquiries',
  },
  {
    up: migration_20260107_183303_inquiries_add_new_field_phone.up,
    down: migration_20260107_183303_inquiries_add_new_field_phone.down,
    name: '20260107_183303_inquiries_add_new_field_phone'
  },
];
