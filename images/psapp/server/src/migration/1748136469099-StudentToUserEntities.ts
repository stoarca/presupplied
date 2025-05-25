import { MigrationInterface, QueryRunner } from "typeorm";

export class StudentToUserEntities1748136469099 implements MigrationInterface {
    name = 'StudentToUserEntities1748136469099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3e7b22e6876b810eac4bcfae3c"`);
        await queryRunner.query(`CREATE TYPE "public"."user_progress_video_status_enum" AS ENUM('not_watched', 'watched')`);
        await queryRunner.query(`CREATE TABLE "user_progress_video" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "video_vanity_id" character varying NOT NULL, "status" "public"."user_progress_video_status_enum" NOT NULL DEFAULT 'not_watched', "user_progress_id" integer, CONSTRAINT "PK_user_progress_video" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_progress_video_user_progress_id_video_vanity_id" ON "user_progress_video" ("user_progress_id", "video_vanity_id") `);
        await queryRunner.query(`CREATE TYPE "public"."user_type_enum" AS ENUM('parent', 'teacher', 'student')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying, "hashed" character varying, "type" "public"."user_type_enum" NOT NULL DEFAULT 'student', "profile_picture" json, "pin" character varying, "pin_required" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_user" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_email_unique_where_not_null" ON "user" ("email") WHERE email IS NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."user_relationship_type_enum" AS ENUM('primary', 'secondary', 'observer')`);
        await queryRunner.query(`CREATE TABLE "user_relationship" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "adult_id" integer NOT NULL, "child_id" integer NOT NULL, "type" "public"."user_relationship_type_enum" NOT NULL DEFAULT 'observer', CONSTRAINT "PK_user_relationship" PRIMARY KEY ("adult_id", "child_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_progress_status_enum" AS ENUM('not_attempted', 'attempted', 'passed')`);
        await queryRunner.query(`CREATE TABLE "user_progress" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."user_progress_status_enum" NOT NULL DEFAULT 'not_attempted', "user_id" integer, "module_id" integer, CONSTRAINT "PK_user_progress" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_progress_user_id_module_id" ON "user_progress" ("user_id", "module_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_module_vanity_id" ON "module" ("vanity_id") `);
        await queryRunner.query(`ALTER TABLE "user_progress_video" ADD CONSTRAINT "FK_user_progress_video_user_progress_id" FOREIGN KEY ("user_progress_id") REFERENCES "user_progress"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_relationship" ADD CONSTRAINT "FK_user_relationship_adult_id" FOREIGN KEY ("adult_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_relationship" ADD CONSTRAINT "FK_user_relationship_child_id" FOREIGN KEY ("child_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_user_progress_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_user_progress_module_id" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_user_progress_module_id"`);
        await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_user_progress_user_id"`);
        await queryRunner.query(`ALTER TABLE "user_relationship" DROP CONSTRAINT "FK_user_relationship_child_id"`);
        await queryRunner.query(`ALTER TABLE "user_relationship" DROP CONSTRAINT "FK_user_relationship_adult_id"`);
        await queryRunner.query(`ALTER TABLE "user_progress_video" DROP CONSTRAINT "FK_user_progress_video_user_progress_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_module_vanity_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_progress_user_id_module_id"`);
        await queryRunner.query(`DROP TABLE "user_progress"`);
        await queryRunner.query(`DROP TYPE "public"."user_progress_status_enum"`);
        await queryRunner.query(`DROP TABLE "user_relationship"`);
        await queryRunner.query(`DROP TYPE "public"."user_relationship_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_email_unique_where_not_null"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_progress_video_user_progress_id_video_vanity_id"`);
        await queryRunner.query(`DROP TABLE "user_progress_video"`);
        await queryRunner.query(`DROP TYPE "public"."user_progress_video_status_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3e7b22e6876b810eac4bcfae3c" ON "module" ("vanity_id") `);
    }

}
