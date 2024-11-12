using Microsoft.EntityFrameworkCore.Migrations;

namespace LocalEducation.Data.Migrations
{
	/// <inheritdoc />
	public partial class UpdateMapping : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AlterColumn<string>(
				name: "UrlPath",
				table: "Lessons",
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
				table: "Lessons",
				type: "nvarchar(512)",
				maxLength: 512,
				nullable: true,
				defaultValue: "",
				oldClrType: typeof(string),
				oldType: "nvarchar(512)",
				oldMaxLength: 512,
				oldDefaultValue: "");

			migrationBuilder.AlterColumn<string>(
				name: "Description",
				table: "Lessons",
				type: "nvarchar(max)",
				maxLength: 4096,
				nullable: true,
				defaultValue: "",
				oldClrType: typeof(string),
				oldType: "nvarchar(max)",
				oldMaxLength: 4096,
				oldDefaultValue: "");

			migrationBuilder.AlterColumn<string>(
				name: "UrlPath",
				table: "Courses",
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
				table: "Courses",
				type: "nvarchar(512)",
				maxLength: 512,
				nullable: true,
				defaultValue: "",
				oldClrType: typeof(string),
				oldType: "nvarchar(512)",
				oldMaxLength: 512,
				oldDefaultValue: "");

			migrationBuilder.AlterColumn<string>(
				name: "Description",
				table: "Courses",
				type: "nvarchar(max)",
				maxLength: 4096,
				nullable: true,
				defaultValue: "",
				oldClrType: typeof(string),
				oldType: "nvarchar(max)",
				oldMaxLength: 4096,
				oldDefaultValue: "");
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AlterColumn<string>(
				name: "UrlPath",
				table: "Lessons",
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
				table: "Lessons",
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
				name: "Description",
				table: "Lessons",
				type: "nvarchar(max)",
				maxLength: 4096,
				nullable: false,
				defaultValue: "",
				oldClrType: typeof(string),
				oldType: "nvarchar(max)",
				oldMaxLength: 4096,
				oldNullable: true,
				oldDefaultValue: "");

			migrationBuilder.AlterColumn<string>(
				name: "UrlPath",
				table: "Courses",
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
				table: "Courses",
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
				name: "Description",
				table: "Courses",
				type: "nvarchar(max)",
				maxLength: 4096,
				nullable: false,
				defaultValue: "",
				oldClrType: typeof(string),
				oldType: "nvarchar(max)",
				oldMaxLength: 4096,
				oldNullable: true,
				oldDefaultValue: "");
		}
	}
}
