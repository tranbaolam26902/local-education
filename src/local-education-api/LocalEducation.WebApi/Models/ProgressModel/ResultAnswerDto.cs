using LocalEducation.Core.Dto;

namespace LocalEducation.WebApi.Models.ProgressModel;

public class ResultAnswerDto
{
	public int CountCorrect { get; set; }

	public int CountIncorrect { get; set; }

	public IList<AnswerItem> Corrects { get; set; }

	public IList<AnswerItem> Incorrects { get; set; }

}