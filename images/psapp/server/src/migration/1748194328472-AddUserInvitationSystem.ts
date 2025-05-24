import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserInvitationSystem1748194328472 implements MigrationInterface {
    name = 'AddUserInvitationSystem1748194328472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_invitation_relationship_type_enum" AS ENUM('primary', 'secondary', 'observer')`);
        await queryRunner.query(`CREATE TYPE "public"."user_invitation_status_enum" AS ENUM('pending', 'accepted', 'rejected', 'expired')`);
        await queryRunner.query(`CREATE TABLE "user_invitation" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "inviter_id" integer NOT NULL, "child_id" integer NOT NULL, "invitee_email" character varying NOT NULL, "relationship_type" "public"."user_invitation_relationship_type_enum" NOT NULL DEFAULT 'observer', "status" "public"."user_invitation_status_enum" NOT NULL DEFAULT 'pending', "invitee_user_id" integer, "expires_at" TIMESTAMP, "token" character varying NOT NULL, CONSTRAINT "UQ_user_invitation_token" UNIQUE ("token"), CONSTRAINT "PK_user_invitation" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_user_invitation_invitee_email" ON "user_invitation" ("invitee_email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_invitation_invitee_email_child_id" ON "user_invitation" ("invitee_email", "child_id") `);
        await queryRunner.query(`ALTER TABLE "user_invitation" ADD CONSTRAINT "FK_user_invitation_inviter_id" FOREIGN KEY ("inviter_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_invitation" ADD CONSTRAINT "FK_user_invitation_child_id" FOREIGN KEY ("child_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_invitation" ADD CONSTRAINT "FK_user_invitation_invitee_user_id" FOREIGN KEY ("invitee_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_invitation" DROP CONSTRAINT "FK_user_invitation_invitee_user_id"`);
        await queryRunner.query(`ALTER TABLE "user_invitation" DROP CONSTRAINT "FK_user_invitation_child_id"`);
        await queryRunner.query(`ALTER TABLE "user_invitation" DROP CONSTRAINT "FK_user_invitation_inviter_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_invitation_invitee_email_child_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_invitation_invitee_email"`);
        await queryRunner.query(`DROP TABLE "user_invitation"`);
        await queryRunner.query(`DROP TYPE "public"."user_invitation_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_invitation_relationship_type_enum"`);
    }

}
