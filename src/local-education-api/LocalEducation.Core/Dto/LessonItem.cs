using LocalEducation.Core.Entities;

namespace LocalEducation.Core.Dto;

public class LessonItem
{
	public Guid Id { get; set; }

	public string Title { get; set; }

	public string ThumbnailPath { get; set; }

	public string UrlPath { get; set; }

	public int Index { get; set; }

	public bool IsVr { get; set; }

	public string TourSlug { get; set; }

	public int TotalSlide { get; set; }

	public bool IsPublished { get; set; }

	public string Description { get; set; }

	public IList<SlideItem> Slides { get; set; }

	public LessonItem(Lesson l)
	{
		Id = l.Id;
		Title = l.Title;
		ThumbnailPath = l.ThumbnailPath;
		UrlPath = l.UrlPath;
		Index = l.Index;
		IsVr = l.IsVr;
		TourSlug = l.TourSlug;
		Slides = l.Slides?.Select(s => new SlideItem(s)).ToList();
		TotalSlide = Slides?.Count ?? 0;
		IsPublished = l.IsPublished;
		Description = l.Description;
	}
}