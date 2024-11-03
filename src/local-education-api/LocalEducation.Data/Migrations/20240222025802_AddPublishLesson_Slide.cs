using Microsoft.EntityFrameworkCore.Migrations;

namespace LocalEducation.Data.Migrations
{
	/// <inheritdoc />
	public partial class AddPublishLesson_Slide : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AddColumn<bool>(
				name: "IsPublished",
				table: "Slides",
				type: "bit",
				nullable: false,
				defaultValue: false);

			migrationBuilder.AddColumn<bool>(
				name: "IsPublished",
				table: "Lessons",
				type: "bit",
				nullable: false,
				defaultValue: false);
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropColumn(
				name: "IsPublished",
				table: "Slides");

			migrationBuilder.DropColumn(
				name: "IsPublished",
				table: "Lessons");
		}
	}
}
