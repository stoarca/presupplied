import { MigrationInterface, QueryRunner } from "typeorm";

export class UserParentTeacherRelationship1746931265580 implements MigrationInterface {
    name = 'UserParentTeacherRelationship1746931265580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create UserType enum
        await queryRunner.query(`CREATE TYPE "public"."user_type_enum" AS ENUM('parent', 'teacher', 'student')`);
        
        // Rename student table to user
        await queryRunner.query(`ALTER TABLE "student" RENAME TO "user"`);
        
        // Add new columns to user table
        await queryRunner.query(`ALTER TABLE "user" ADD "type" "public"."user_type_enum" NOT NULL DEFAULT 'student'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profile_picture" json`);
        await queryRunner.query(`ALTER TABLE "user" ADD "pin" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "pin_required" boolean NOT NULL DEFAULT false`);
        
        // Make email and hashed nullable
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "hashed" DROP NOT NULL`);
        
        // Update index on email
        await queryRunner.query(`DROP INDEX "IDX_a56c051c91dbe1068ad683f536"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_email_unique_where_not_null" ON "user" ("email") WHERE email IS NOT NULL`);
        
        // Rename student_progress table and student_id column
        await queryRunner.query(`ALTER TABLE "student_progress" RENAME TO "user_progress"`);
        await queryRunner.query(`ALTER TABLE "user_progress" RENAME COLUMN "student_id" TO "user_id"`);
        
        // Update foreign key and index for user_progress
        await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_760b6a9d017ba81f2a33b1bddee"`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_user_progress_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX "IDX_1cf5e7c110ba33d9e2f67eb2f9"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_progress_user_module" ON "user_progress" ("user_id", "module_id")`);
        
        // Rename student_progress_video table and student_progress_id column
        await queryRunner.query(`ALTER TABLE "student_progress_video" RENAME TO "user_progress_video"`);
        await queryRunner.query(`ALTER TABLE "user_progress_video" RENAME COLUMN "student_progress_id" TO "user_progress_id"`);
        
        // Update foreign key and index for user_progress_video
        await queryRunner.query(`ALTER TABLE "user_progress_video" DROP CONSTRAINT "FK_e3da7f4c75bbf13705a9b7d8378"`);
        await queryRunner.query(`ALTER TABLE "user_progress_video" ADD CONSTRAINT "FK_user_progress_video_user_progress" FOREIGN KEY ("user_progress_id") REFERENCES "user_progress"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX "IDX_470ffd4985fded33a42705975d"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_progress_video_progress_vanity" ON "user_progress_video" ("user_progress_id", "video_vanity_id")`);
        
        // Update existing users to set type
        await queryRunner.query(`UPDATE "user" SET "type" = 'student'`);
        
        // Create RelationshipType enum
        await queryRunner.query(`CREATE TYPE "public"."user_relationship_type_enum" AS ENUM('primary', 'secondary', 'observer')`);
        
        // Create UserRelationship table
        await queryRunner.query(`CREATE TABLE "user_relationship" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "adult_id" integer NOT NULL,
            "child_id" integer NOT NULL,
            "type" "public"."user_relationship_type_enum" NOT NULL DEFAULT 'observer',
            CONSTRAINT "PK_user_relationship" PRIMARY KEY ("id")
        )`);
        
        // Create index and foreign keys for user_relationship
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_relationship_adult_child" ON "user_relationship" ("adult_id", "child_id")`);
        await queryRunner.query(`ALTER TABLE "user_relationship" ADD CONSTRAINT "FK_user_relationship_adult" FOREIGN KEY ("adult_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_relationship" ADD CONSTRAINT "FK_user_relationship_child" FOREIGN KEY ("child_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop UserRelationship table
        await queryRunner.query(`ALTER TABLE "user_relationship" DROP CONSTRAINT "FK_user_relationship_child"`);
        await queryRunner.query(`ALTER TABLE "user_relationship" DROP CONSTRAINT "FK_user_relationship_adult"`);
        await queryRunner.query(`DROP INDEX "IDX_user_relationship_adult_child"`);
        await queryRunner.query(`DROP TABLE "user_relationship"`);
        await queryRunner.query(`DROP TYPE "public"."user_relationship_type_enum"`);
        
        // Revert UserProgressVideo changes
        await queryRunner.query(`DROP INDEX "IDX_user_progress_video_progress_vanity"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_470ffd4985fded33a42705975d" ON "user_progress_video" ("user_progress_id", "video_vanity_id")`);
        await queryRunner.query(`ALTER TABLE "user_progress_video" DROP CONSTRAINT "FK_user_progress_video_user_progress"`);
        await queryRunner.query(`ALTER TABLE "user_progress_video" ADD CONSTRAINT "FK_e3da7f4c75bbf13705a9b7d8378" FOREIGN KEY ("user_progress_id") REFERENCES "user_progress"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_progress_video" RENAME COLUMN "user_progress_id" TO "student_progress_id"`);
        await queryRunner.query(`ALTER TABLE "user_progress_video" RENAME TO "student_progress_video"`);
        
        // Revert UserProgress changes
        await queryRunner.query(`DROP INDEX "IDX_user_progress_user_module"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1cf5e7c110ba33d9e2f67eb2f9" ON "user_progress" ("user_id", "module_id")`);
        await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_user_progress_user"`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_760b6a9d017ba81f2a33b1bddee" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_progress" RENAME COLUMN "user_id" TO "student_id"`);
        await queryRunner.query(`ALTER TABLE "user_progress" RENAME TO "student_progress"`);
        
        // Revert User table changes
        await queryRunner.query(`DROP INDEX "IDX_user_email_unique_where_not_null"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a56c051c91dbe1068ad683f536" ON "user" ("email")`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "hashed" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pin_required"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pin"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile_picture"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "student"`);
        await queryRunner.query(`DROP TYPE "public"."user_type_enum"`);
    }
}