using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Entities;

public class Lesson : IEntity
{
	public Guid Id { get; set; }

	public DateTime CreatedDate { get; set; }

	public Guid CourseId { get; set; }

	public string Title { get; set; }

	public string UrlSlug { get; set; }

	public string Description { get; set; }

	public string ThumbnailPath { get; set; }

	public string UrlPath { get; set; }

	public int Index { get; set; }

	public bool IsVr { get; set; }

	public string TourSlug { get; set; }

	public bool IsPublished { get; set; }


	// ======================================================
	// Navigation properties
	// ======================================================

	public Course Course { get; set; }

	public IList<Slide> Slides { get; set; }
}