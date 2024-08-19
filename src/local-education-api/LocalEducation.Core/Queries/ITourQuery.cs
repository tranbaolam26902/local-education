namespace LocalEducation.Core.Queries;

public interface ITourQuery
{
	public string Keyword { get; set; }

	public string AuthorName { get; set; }

	public bool IsDeleted { get; set; }

	public bool IsPublished { get; set; }

	public bool NonPublished { get; set; }
}