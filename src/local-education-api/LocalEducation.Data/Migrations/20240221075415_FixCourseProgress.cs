using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LocalEducation.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixCourseProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsLookedProgress",
                table: "Courses",
                newName: "IsLockedProgress");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsLockedProgress",
                table: "Courses",
                newName: "IsLookedProgress");
        }
    }
}
