import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "products_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  ALTER TABLE "products_gallery_images" ADD CONSTRAINT "products_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_gallery_images" ADD CONSTRAINT "products_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_gallery_images_order_idx" ON "products_gallery_images" USING btree ("_order");
  CREATE INDEX "products_gallery_images_parent_id_idx" ON "products_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_images_image_idx" ON "products_gallery_images" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_gallery_images" CASCADE;`)
}
