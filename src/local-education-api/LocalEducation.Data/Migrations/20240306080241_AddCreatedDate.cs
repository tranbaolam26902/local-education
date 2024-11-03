using Microsoft.EntityFrameworkCore.Migrations;

namespace LocalEducation.Data.Migrations
{
	/// <inheritdoc />
	public partial class AddCreatedDate : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AddColumn<DateTime>(
				name: "CreatedDate",
				table: "UserLogins",
				type: "datetime",
				nullable: false,
				defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

			migrationBuilder.AddColumn<DateTime>(
				name: "CreatedDate",
				table: "Slides",
				type: "datetime",
				nullable: false,
				defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

			migrationBuilder.AddColumn<DateTime>(
				name: "CreatedDate",
				table: "Scenes",
				type: "datetime2",
				nullable: false,
				defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

			migrationBuilder.AddColumn<DateTime>(
				name: "CreatedDate",
				table: "Progresses",
				type: "datetime",
				nullable: false,
				defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

			migrationBuilder.AddColumn<DateTime>(
				name: "CreatedDate",
				table: "Pins",
				type: "datetime2",
				nullable: false,
				defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

			migrationBuilder.AddColumn<DateTime>(
				name: "CreatedDate",
				table: "LinkHotspots",
				type: "datetime",
				nullable: false,
				defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

			migrationBuilder.AddColumn<DateTime>(
				name: "CreatedDate",
				table: "Lessons",
				type: "datetime",
				nullable: false,
				defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

			migrationBuilder.AddColumn<DateTime>(
				name: "CreatedDate",
				table: "InfoHotspots",
				type: "datetime",
				nullable: false,
				defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

			migrationBuilder.AddColumn<DateTime>(
				name: "CreatedDate",
				table: "Atlases",
				type: "datetime2",
				nullable: false,
				defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropColumn(
				name: "CreatedDate",
				table: "UserLogins");

			migrationBuilder.DropColumn(
				name: "CreatedDate",
				table: "Slides");

			migrationBuilder.DropColumn(
				name: "CreatedDate",
				table: "Scenes");

			migrationBuilder.DropColumn(
				name: "CreatedDate",
				table: "Progresses");

			migrationBuilder.DropColumn(
				name: "CreatedDate",
				table: "Pins");

			migrationBuilder.DropColumn(
				name: "CreatedDate",
				table: "LinkHotspots");

			migrationBuilder.DropColumn(
				name: "CreatedDate",
				table: "Lessons");

			migrationBuilder.DropColumn(
				name: "CreatedDate",
				table: "InfoHotspots");

			migrationBuilder.DropColumn(
				name: "CreatedDate",
				table: "Atlases");
		}
	}
}
