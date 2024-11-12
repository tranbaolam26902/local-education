using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Entities;

public class Progress : IEntity
{
	public Guid Id { get; set; }

	public Guid UserId { get; set; }

	public Guid CourseId { get; set; }

	public DateTime CreatedDate { get; set; }

	public string Slides { get; set; }

	// ======================================================
	// Navigation properties
	// ======================================================

	public Course Course { get; set; }

	public User User { get; set; }
}