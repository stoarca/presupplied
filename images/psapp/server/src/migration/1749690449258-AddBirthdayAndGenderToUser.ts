import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBirthdayAndGenderToUser1749690449258 implements MigrationInterface {
    name = 'AddBirthdayAndGenderToUser1749690449258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "birthday" date`);
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" "public"."user_gender_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthday"`);
    }

}
