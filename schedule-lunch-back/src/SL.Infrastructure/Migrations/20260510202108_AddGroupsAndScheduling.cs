using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SL.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupsAndScheduling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "role",
                schema: "schedule",
                table: "t_users",
                type: "text",
                nullable: false,
                defaultValue: "User");

            migrationBuilder.CreateTable(
                name: "t_groups",
                schema: "schedule",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_t_groups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "t_group_memberships",
                schema: "schedule",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    GroupId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_t_group_memberships", x => new { x.UserId, x.GroupId });
                    table.ForeignKey(
                        name: "FK_t_group_memberships_t_groups_GroupId",
                        column: x => x.GroupId,
                        principalSchema: "schedule",
                        principalTable: "t_groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_t_group_memberships_t_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "schedule",
                        principalTable: "t_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "t_time_slots",
                schema: "schedule",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GroupId = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    Label = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    Capacity = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_t_time_slots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_t_time_slots_t_groups_GroupId",
                        column: x => x.GroupId,
                        principalSchema: "schedule",
                        principalTable: "t_groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "t_attendances",
                schema: "schedule",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    TimeSlotId = table.Column<Guid>(type: "uuid", nullable: false),
                    ReservedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_t_attendances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_t_attendances_t_time_slots_TimeSlotId",
                        column: x => x.TimeSlotId,
                        principalSchema: "schedule",
                        principalTable: "t_time_slots",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_t_attendances_t_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "schedule",
                        principalTable: "t_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_t_attendances_TimeSlotId",
                schema: "schedule",
                table: "t_attendances",
                column: "TimeSlotId");

            migrationBuilder.CreateIndex(
                name: "IX_t_attendances_UserId_TimeSlotId",
                schema: "schedule",
                table: "t_attendances",
                columns: new[] { "UserId", "TimeSlotId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_t_group_memberships_GroupId",
                schema: "schedule",
                table: "t_group_memberships",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_t_time_slots_GroupId",
                schema: "schedule",
                table: "t_time_slots",
                column: "GroupId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "t_attendances",
                schema: "schedule");

            migrationBuilder.DropTable(
                name: "t_group_memberships",
                schema: "schedule");

            migrationBuilder.DropTable(
                name: "t_time_slots",
                schema: "schedule");

            migrationBuilder.DropTable(
                name: "t_groups",
                schema: "schedule");

            migrationBuilder.DropColumn(
                name: "role",
                schema: "schedule",
                table: "t_users");
        }
    }
}
