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

        // Drop old student tables
        await queryRunner.query(`DROP TABLE IF EXISTS "student_progress_video"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student_progress"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "student"`);
        
        // Drop old enum types
        await queryRunner.query(`DROP TYPE IF EXISTS "student_progress_video_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "student_progress_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop all User-based tables and constraints
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
        
        // Recreate original student tables in the correct order (dependencies last)
        
        // 1. Recreate student table (from Initial migration + AddCreatedAtUpdatedAtCols)
        await queryRunner.query(`CREATE TABLE "student" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "hashed" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a56c051c91dbe1068ad683f536" ON "student" ("email") `);
        
        // 2. Recreate student_progress enum and table (from StudentProgress migration + AddCreatedAtUpdatedAtCols)
        await queryRunner.query(`CREATE TYPE "public"."student_progress_status_enum" AS ENUM('not_attempted', 'attempted', 'passed')`);
        await queryRunner.query(`CREATE TABLE "student_progress" ("id" SERIAL NOT NULL, "status" "public"."student_progress_status_enum" NOT NULL DEFAULT 'not_attempted', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "student_id" integer, "module_id" integer, CONSTRAINT "PK_e7df7ebbbab37cc250594423a38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1cf5e7c110ba33d9e2f67eb2f9" ON "student_progress" ("student_id", "module_id") `);
        await queryRunner.query(`ALTER TABLE "student_progress" ADD CONSTRAINT "FK_760b6a9d017ba81f2a33b1bddee" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_progress" ADD CONSTRAINT "FK_b109d4c21740d0c62fed058f64a" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        // 3. Recreate student_progress_video enum and table (from AddVideoForStudentProgress migration)
        await queryRunner.query(`CREATE TYPE "public"."student_progress_video_status_enum" AS ENUM('not_watched', 'watched')`);
        await queryRunner.query(`CREATE TABLE "student_progress_video" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "video_vanity_id" character varying NOT NULL, "status" "public"."student_progress_video_status_enum" NOT NULL DEFAULT 'not_watched', "student_progress_id" integer, CONSTRAINT "PK_6fc833e37bb23a14d7b5e8541d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_470ffd4985fded33a42705975d" ON "student_progress_video" ("student_progress_id", "video_vanity_id") `);
        await queryRunner.query(`ALTER TABLE "student_progress_video" ADD CONSTRAINT "FK_e3da7f4c75bbf13705a9b7d8378" FOREIGN KEY ("student_progress_id") REFERENCES "student_progress"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        // 4. Recreate the original module vanity_id index (as it was before this migration)
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3e7b22e6876b810eac4bcfae3c" ON "module" ("vanity_id") `);
    }

}
