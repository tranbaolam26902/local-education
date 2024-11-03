using LocalEducation.Core.Entities;
using LocalEducation.WebApi.Models.QuestionModel;
using OfficeOpenXml;
using File = System.IO.File;

namespace LocalEducation.WebApi.Utilities;

public class ExcelExporter
{
	public static float ExportQuestionsToExcel(IList<QuestionEditModel> questions, string filePath)
	{
		ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
		// Create a new Excel package
		using ExcelPackage package = new();
		// Add a worksheet to the package
		ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Questions");

		// Write headers
		worksheet.Cells[1, 1].Value = "Đề bài";
		worksheet.Cells[1, 2].Value = "URL";
		worksheet.Cells[1, 3].Value = "Điểm";
		worksheet.Cells[1, 4].Value = "Câu";
		worksheet.Cells[1, 5].Value = "Thứ tự đúng";
		worksheet.Cells[1, 6].Value = "Thứ tự đáp án";
		worksheet.Cells[1, 7].Value = "Nội dung đáp án";

		// Write data
		int row = 2;
		foreach (QuestionEditModel question in questions)
		{
			worksheet.Cells[row, 1].Value = question.Content;
			worksheet.Cells[row, 2].Value = question.Url;
			worksheet.Cells[row, 3].Value = question.Point;
			worksheet.Cells[row, 5].Value = question.IndexCorrect;

			foreach (OptionEditModel option in question.Options)
			{
				worksheet.Cells[row, 4].Value = question.Index;
				worksheet.Cells[row, 6].Value = option.Index;
				worksheet.Cells[row, 7].Value = option.Content;
				row++;
			}
		}

		// Save the Excel package to a file
		string fullPath = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", filePath));
		File.WriteAllBytes(fullPath, package.GetAsByteArray());

		FileInfo fileInfo = new(fullPath);
		return fileInfo.Length;
	}

	public static List<Question> ImportQuestionsFromExcel(string filePath)
	{
		try
		{
			ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

			List<Question> questions = [];

			string fullPath = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot", filePath));
			using ExcelPackage package = new(new FileInfo(fullPath));
			ExcelWorksheet worksheet = package.Workbook.Worksheets.First();

			int rowCount = worksheet.Dimension.Rows;
			for (int row = 2; row <= rowCount; row++)
			{
				string content = worksheet.Cells[row, 1].Value?.ToString();
				string url = worksheet.Cells[row, 2].Value?.ToString();
				double point = Convert.ToDouble(worksheet.Cells[row, 3].Value);
				int index = Convert.ToInt32(worksheet.Cells[row, 4].Value);
				int indexCorrect = Convert.ToInt32(worksheet.Cells[row, 5].Value);
				int optionIndex = Convert.ToInt32(worksheet.Cells[row, 6].Value);
				string optionContent = worksheet.Cells[row, 7].Value?.ToString();

				Question question = questions.FirstOrDefault(q => q.Index == index);
				if (question == null)
				{
					question = new Question
					{
						Content = content,
						Url = url,
						Point = point,
						Index = index,
						IndexCorrect = indexCorrect,
						CreatedDate = DateTime.Now,
						Options = []
					};
					questions.Add(question);
				}

				question.Options.Add(new Option
				{
					Index = optionIndex,
					Content = optionContent
				});
			}

			return questions;

		}
		catch (Exception e)
		{
			return null;
		}
	}
}