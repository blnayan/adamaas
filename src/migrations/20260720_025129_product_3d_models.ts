import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN "model3d_id" integer;
  ALTER TABLE "products" ADD COLUMN "model_usdz_id" integer;
  ALTER TABLE "products" ADD CONSTRAINT "products_model3d_id_media_id_fk" FOREIGN KEY ("model3d_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_model_usdz_id_media_id_fk" FOREIGN KEY ("model_usdz_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_model3d_idx" ON "products" USING btree ("model3d_id");
  CREATE INDEX "products_model_usdz_idx" ON "products" USING btree ("model_usdz_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP CONSTRAINT "products_model3d_id_media_id_fk";
  
  ALTER TABLE "products" DROP CONSTRAINT "products_model_usdz_id_media_id_fk";
  
  DROP INDEX "products_model3d_idx";
  DROP INDEX "products_model_usdz_idx";
  ALTER TABLE "products" DROP COLUMN "model3d_id";
  ALTER TABLE "products" DROP COLUMN "model_usdz_id";`)
}
