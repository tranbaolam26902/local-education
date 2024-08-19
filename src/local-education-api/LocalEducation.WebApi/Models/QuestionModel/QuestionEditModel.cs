namespace LocalEducation.WebApi.Models.QuestionModel;

public class QuestionEditModel
{
    public string Content { get; set; }

    public string Url { get; set; }

    public double Point { get; set; }

    public int Index { get; set; }

    public int IndexCorrect { get; set; }

    public IList<OptionEditModel> Options { get; set; }
}