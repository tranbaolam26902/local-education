using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Entities;

public class ResultDetail : IEntity
{
	public Guid Id { get; set; }

	public DateTime CreatedDate { get; set; }

	public Guid UserId { get; set; }

	public Guid SlideId { get; set; }

	public double Point { get; set; }

	public string Answer { get; set; }

	public string CorrectAnswer { get; set; }

	// ======================================================
	// Navigation properties
	// ======================================================

	public Slide Slide { get; set; }

	public User User { get; set; }
}