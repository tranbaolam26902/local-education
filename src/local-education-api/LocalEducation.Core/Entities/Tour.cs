using LocalEducation.Core.Contracts;
using static System.Formats.Asn1.AsnWriter;

namespace LocalEducation.Core.Entities;

public class Tour : IEntity
{
	public Guid Id { get; set; }

	public Guid UserId { get; set; }

	public string Title { get; set; }

	public string UrlSlug { get; set; }

	public DateTime CreatedDate { get; set; }

	public int ViewCount { get; set; }

	public bool IsPublished { get; set; }

	public bool IsDeleted { get; set; }

	// ======================================================
	// Navigation properties
	// ======================================================

	public IList<Scene> Scenes { get; set; }

    public Atlas Atlas { get; set; }

	public User User { get; set; }

	public Tour()
	{
		
	}

	public Tour(Guid id, Guid userId, string title, string urlSlug, DateTime createdDate, int viewCount, bool isPublished, bool isDeleted)
	{
		Id = id;
		UserId = userId;
		Title = title;
		UrlSlug = urlSlug;
		CreatedDate = createdDate;
		ViewCount = viewCount;
		IsPublished = isPublished;
		IsDeleted = isDeleted;
	}
}