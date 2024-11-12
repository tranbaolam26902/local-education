namespace LocalEducation.WebApi.Models.QuestionModel;

public class OptionDto
{
	public Guid Id { get; set; }

	public Guid QuestionId { get; set; }

	public int Index { get; set; }

	public string Content { get; set; }
}