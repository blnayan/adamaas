import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "products_download_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "products_use_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  ALTER TABLE "products_variants" ADD COLUMN "description" varchar;
  ALTER TABLE "products" ADD COLUMN "hero_description" varchar;
  ALTER TABLE "products_download_files" ADD CONSTRAINT "products_download_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_download_files" ADD CONSTRAINT "products_download_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_use_cases" ADD CONSTRAINT "products_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_download_files_order_idx" ON "products_download_files" USING btree ("_order");
  CREATE INDEX "products_download_files_parent_id_idx" ON "products_download_files" USING btree ("_parent_id");
  CREATE INDEX "products_download_files_file_idx" ON "products_download_files" USING btree ("file_id");
  CREATE INDEX "products_use_cases_order_idx" ON "products_use_cases" USING btree ("_order");
  CREATE INDEX "products_use_cases_parent_id_idx" ON "products_use_cases" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_download_files" CASCADE;
  DROP TABLE "products_use_cases" CASCADE;
  ALTER TABLE "products_variants" DROP COLUMN "description";
  ALTER TABLE "products" DROP COLUMN "hero_description";`)
}
