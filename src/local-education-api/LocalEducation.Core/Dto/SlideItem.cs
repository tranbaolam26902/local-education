using LocalEducation.Core.Entities;

namespace LocalEducation.Core.Dto;

public class SlideItem
{
	public Guid Id { get; set; }

	public string Title { get; set; }

	public int Index { get; set; }

	public string ThumbnailPath { get; set; }

	public string UrlPath { get; set; }

	public string Layout { get; set; }

	public bool IsPublished { get; set; }


	public SlideItem(Slide s)
	{
		Id = s.Id;
		Title = s.Title;
		Index = s.Index;
		ThumbnailPath = s.ThumbnailPath;
		UrlPath = s.UrlPath;
		IsPublished = s.IsPublished;
		Layout = s.Layout;
	}
}