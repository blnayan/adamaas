import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" RENAME COLUMN "image_id" TO "hero_image_id";
  ALTER TABLE "products" DROP CONSTRAINT "products_image_id_media_id_fk";
  
  DROP INDEX "products_image_idx";
  ALTER TABLE "products" ADD CONSTRAINT "products_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_hero_image_idx" ON "products" USING btree ("hero_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" RENAME COLUMN "hero_image_id" TO "image_id";
  ALTER TABLE "products" DROP CONSTRAINT "products_hero_image_id_media_id_fk";
  
  DROP INDEX "products_hero_image_idx";
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");`)
}
