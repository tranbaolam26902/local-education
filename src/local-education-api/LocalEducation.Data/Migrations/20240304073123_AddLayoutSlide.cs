using Microsoft.EntityFrameworkCore.Migrations;

namespace LocalEducation.Data.Migrations
{
	/// <inheritdoc />
	public partial class AddLayoutSlide : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AlterColumn<string>(
				name: "UrlPath",
				table: "Slides",
				type: "nvarchar(512)",
				maxLength: 512,
				nullable: true,
				defaultValue: "",
				oldClrType: typeof(string),
				oldType: "nvarchar(512)",
				oldMaxLength: 512,
				oldDefaultValue: "");

			migrationBuilder.AlterColumn<string>(
				name: "ThumbnailPath",
				table: "Slides",
				type: "nvarchar(512)",
				maxLength: 512,
				nullable: true,
				defaultValue: "",
				oldClrType: typeof(string),
				oldType: "nvarchar(512)",
				oldMaxLength: 512,
				oldDefaultValue: "");

			migrationBuilder.AddColumn<string>(
				name: "Layout",
				table: "Slides",
				type: "nvarchar(512)",
				maxLength: 512,
				nullable: true);
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropColumn(
				name: "Layout",
				table: "Slides");

			migrationBuilder.AlterColumn<string>(
				name: "UrlPath",
				table: "Slides",
				type: "nvarchar(512)",
				maxLength: 512,
				nullable: false,
				defaultValue: "",
				oldClrType: typeof(string),
				oldType: "nvarchar(512)",
				oldMaxLength: 512,
				oldNullable: true,
				oldDefaultValue: "");

			migrationBuilder.AlterColumn<string>(
				name: "ThumbnailPath",
				table: "Slides",
				type: "nvarchar(512)",
				maxLength: 512,
				nullable: false,
				defaultValue: "",
				oldClrType: typeof(string),
				oldType: "nvarchar(512)",
				oldMaxLength: 512,
				oldNullable: true,
				oldDefaultValue: "");
		}
	}
}
