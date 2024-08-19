namespace LocalEducation.WebApi.Models.QuestionModel;

public class QuestionDto
{
    public Guid Id { get; set; }

    public DateTime CreatedDate { get; set; }

    public string Content { get; set; }

    public string Url { get; set; }

    public double Point { get; set; }

    public int Index { get; set; }

    public int IndexCorrect { get; set; }

    public Guid SlideId { get; set; }

    public IList<OptionDto> Options { get; set; }

}