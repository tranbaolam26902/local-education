using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Entities;

public class Question : IEntity
{
	public Guid Id { get; set; }

	public DateTime CreatedDate { get; set; }

	public string Content { get; set; }

	public string Url { get; set; }

	public double Point { get; set; }

	public int Index { get; set; }

	public int IndexCorrect { get; set; }

	public Guid SlideId { get; set; }

	// ======================================================
	// Navigation properties
	// ======================================================

	public Slide Slide { get; set; }

	public IList<Option> Options { get; set; }
}

public class Option
{
	public Guid Id { get; set; }

	public Guid QuestionId { get; set; }

	public int Index { get; set; }

	public string Content { get; set; }


	// ======================================================
	// Navigation properties
	// ======================================================

	public Question Question { get; set; }
}