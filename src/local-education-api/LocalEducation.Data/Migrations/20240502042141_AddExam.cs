using Microsoft.EntityFrameworkCore.Migrations;

namespace LocalEducation.Data.Migrations
{
	/// <inheritdoc />
	public partial class AddExam : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AddColumn<bool>(
				name: "IsTest",
				table: "Slides",
				type: "bit",
				nullable: false,
				defaultValue: false);

			migrationBuilder.AddColumn<int>(
				name: "MinPoint",
				table: "Slides",
				type: "int",
				nullable: false,
				defaultValue: 0);

			migrationBuilder.CreateTable(
				name: "Questions",
				columns: table => new
				{
					Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
					CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
					Content = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: false),
					Url = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
					Point = table.Column<double>(type: "float", nullable: false),
					Index = table.Column<int>(type: "int", nullable: false),
					IndexCorrect = table.Column<int>(type: "int", nullable: false),
					SlideId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Questions", x => x.Id);
					table.ForeignKey(
						name: "FK_Questions_Slides_SlideId",
						column: x => x.SlideId,
						principalTable: "Slides",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateTable(
				name: "ResultDetails",
				columns: table => new
				{
					Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
					CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
					UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
					SlideId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
					Point = table.Column<double>(type: "float", nullable: false),
					Answer = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: true),
					CorrectAnswer = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: true)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_ResultDetails", x => x.Id);
					table.ForeignKey(
						name: "FK_ResultDetails_Slides_SlideId",
						column: x => x.SlideId,
						principalTable: "Slides",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
					table.ForeignKey(
						name: "FK_ResultDetails_Users_UserId",
						column: x => x.UserId,
						principalTable: "Users",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateTable(
				name: "Options",
				columns: table => new
				{
					Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
					QuestionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
					Index = table.Column<int>(type: "int", nullable: false),
					Content = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Options", x => x.Id);
					table.ForeignKey(
						name: "FK_Options_Questions_QuestionId",
						column: x => x.QuestionId,
						principalTable: "Questions",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateIndex(
				name: "IX_Options_QuestionId",
				table: "Options",
				column: "QuestionId");

			migrationBuilder.CreateIndex(
				name: "IX_Questions_SlideId",
				table: "Questions",
				column: "SlideId");

			migrationBuilder.CreateIndex(
				name: "IX_ResultDetails_SlideId",
				table: "ResultDetails",
				column: "SlideId");

			migrationBuilder.CreateIndex(
				name: "IX_ResultDetails_UserId",
				table: "ResultDetails",
				column: "UserId");
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
				name: "Options");

			migrationBuilder.DropTable(
				name: "ResultDetails");

			migrationBuilder.DropTable(
				name: "Questions");

			migrationBuilder.DropColumn(
				name: "IsTest",
				table: "Slides");

			migrationBuilder.DropColumn(
				name: "MinPoint",
				table: "Slides");
		}
	}
}
