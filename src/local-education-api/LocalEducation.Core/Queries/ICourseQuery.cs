namespace LocalEducation.Core.Queries;

public interface ICourseQuery
{
	public string Keyword { get; set; }

	public bool IsDeleted { get; set; }

	public bool IsPublished { get; set; }

	public bool NonPublished { get; set; }

	public Guid UserId { get; set; }

	public Guid AuthorId { get; set; }
}