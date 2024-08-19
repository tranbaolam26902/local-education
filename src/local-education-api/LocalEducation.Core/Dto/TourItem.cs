namespace LocalEducation.Core.Dto;

public class TourItem
{
	public Guid Id { get; set; }

	public string Title { get; set; }

	public string UrlSlug { get; set; }

	public DateTime CreatedDate { get; set; }

	public int ViewCount { get; set; }

	public bool IsPublished { get; set; }

	public bool IsDeleted { get; set; }

	public string Username { get; set; }

	public string UrlPreview { get; set; }

	public TourItem(Guid id, Guid userId, string title, string urlSlug, DateTime createdDate, int viewCount, bool isPublished, bool isDeleted, string username, string urlPreview)
	{
		Id = id;
		Title = title;
		UrlSlug = urlSlug;
		CreatedDate = createdDate;
		ViewCount = viewCount;
		IsPublished = isPublished;
		IsDeleted = isDeleted;
		Username = username;
		UrlPreview = urlPreview ?? "";
	}
}