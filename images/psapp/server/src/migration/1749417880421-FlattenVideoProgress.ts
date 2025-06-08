import { MigrationInterface, QueryRunner } from "typeorm";

export class FlattenVideoProgress1749417880421 implements MigrationInterface {
    name = 'FlattenVideoProgress1749417880421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_video_progress_status_enum" AS ENUM('not_watched', 'watched')`);
        await queryRunner.query(`CREATE TABLE "user_video_progress" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "video_id" character varying NOT NULL, "status" "public"."user_video_progress_status_enum" NOT NULL DEFAULT 'not_watched', "user_id" integer, CONSTRAINT "PK_user_video_progress" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_video_progress_user_id_video_id" ON "user_video_progress" ("user_id", "video_id") `);
        await queryRunner.query(`ALTER TABLE "user_video_progress" ADD CONSTRAINT "FK_user_video_progress_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "user_progress_video" DROP CONSTRAINT "FK_user_progress_video_user_progress_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_progress_video_user_progress_id_video_vanity_id"`);
        await queryRunner.query(`DROP TABLE "user_progress_video"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_progress_video" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "video_vanity_id" character varying NOT NULL, "status" "public"."user_progress_video_status_enum" NOT NULL DEFAULT 'not_watched', "user_progress_id" integer, CONSTRAINT "PK_user_progress_video" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_progress_video_user_progress_id_video_vanity_id" ON "user_progress_video" ("user_progress_id", "video_vanity_id") `);
        await queryRunner.query(`ALTER TABLE "user_progress_video" ADD CONSTRAINT "FK_user_progress_video_user_progress_id" FOREIGN KEY ("user_progress_id") REFERENCES "user_progress"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "user_video_progress" DROP CONSTRAINT "FK_user_video_progress_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_video_progress_user_id_video_id"`);
        await queryRunner.query(`DROP TABLE "user_video_progress"`);
        await queryRunner.query(`DROP TYPE "public"."user_video_progress_status_enum"`);
    }

}
