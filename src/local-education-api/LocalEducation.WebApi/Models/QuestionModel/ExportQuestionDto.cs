namespace LocalEducation.WebApi.Models.QuestionModel;

public class ExportQuestionDto
{
	public string FileName { get; set; }

	public IList<QuestionEditModel> Questions { get; set; }

}