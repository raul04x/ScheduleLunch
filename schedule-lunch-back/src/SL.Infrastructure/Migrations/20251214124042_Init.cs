using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SL.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "schedule");

            migrationBuilder.CreateTable(
                name: "t_settings",
                schema: "schedule",
                columns: table => new
                {
                    keyname = table.Column<string>(name: "key-name", type: "character varying(20)", maxLength: 20, nullable: false),
                    config = table.Column<string>(type: "jsonb", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_t_settings", x => x.keyname);
                });

            migrationBuilder.CreateTable(
                name: "t_users",
                schema: "schedule",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    username = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    first_name = table.Column<string>(type: "text", nullable: false),
                    last_name = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_t_users", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_t_settings_key-name",
                schema: "schedule",
                table: "t_settings",
                column: "key-name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_t_users_email",
                schema: "schedule",
                table: "t_users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_t_users_username",
                schema: "schedule",
                table: "t_users",
                column: "username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "t_settings",
                schema: "schedule");

            migrationBuilder.DropTable(
                name: "t_users",
                schema: "schedule");
        }
    }
}
