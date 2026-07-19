import * as migration_20260101_221310_initial from './20260101_221310_initial';
import * as migration_20260105_194231_new_collection_inquiries from './20260105_194231_new_collection_inquiries';
import * as migration_20260107_183303_inquiries_add_new_field_phone from './20260107_183303_inquiries_add_new_field_phone';
import * as migration_20260715_183510_blogs from './20260715_183510_blogs';
import * as migration_20260715_230806_nomad_product_fields from './20260715_230806_nomad_product_fields';
import * as migration_20260716_003601_gallery_images from './20260716_003601_gallery_images';
import * as migration_20260716_034047_hero_image from './20260716_034047_hero_image';
import * as migration_20260719_195952_variant_images_default from './20260719_195952_variant_images_default';

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
    name: '20260107_183303_inquiries_add_new_field_phone',
  },
  {
    up: migration_20260715_183510_blogs.up,
    down: migration_20260715_183510_blogs.down,
    name: '20260715_183510_blogs',
  },
  {
    up: migration_20260715_230806_nomad_product_fields.up,
    down: migration_20260715_230806_nomad_product_fields.down,
    name: '20260715_230806_nomad_product_fields',
  },
  {
    up: migration_20260716_003601_gallery_images.up,
    down: migration_20260716_003601_gallery_images.down,
    name: '20260716_003601_gallery_images',
  },
  {
    up: migration_20260716_034047_hero_image.up,
    down: migration_20260716_034047_hero_image.down,
    name: '20260716_034047_hero_image',
  },
  {
    up: migration_20260719_195952_variant_images_default.up,
    down: migration_20260719_195952_variant_images_default.down,
    name: '20260719_195952_variant_images_default'
  },
];
