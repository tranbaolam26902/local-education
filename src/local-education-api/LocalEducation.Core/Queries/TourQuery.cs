namespace LocalEducation.Core.Queries;

public class TourQuery : ITourQuery
{
	public string Keyword { get; set; } = "";

	public string AuthorName { get; set; } = "";

	public bool IsDeleted { get; set; } = false;

	public bool IsPublished { get; set; } = false;

	public bool NonPublished { get; set; } = false;
}