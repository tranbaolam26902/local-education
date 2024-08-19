namespace LocalEducation.WebApi.Models.TourModel;

public class TourFilterModel : PagingModel
{
	public string Keyword { get; set; } = "";

	public string AuthorName { get; set; } = "";
}

public class TourFilterByUser : TourFilterModel
{
	public bool? IsDeleted { get; set; } = false;

	public bool? IsPublished { get; set; } = false;

	public bool? NonPublished { get; set; } = false;
}