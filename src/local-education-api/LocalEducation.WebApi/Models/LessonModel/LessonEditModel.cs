namespace LocalEducation.WebApi.Models.LessonModel;

public class LessonEditModel
{
	public string Title { get; set; }

	public string Description { get; set; }

	public string ThumbnailPath { get; set; }

	public string UrlPath { get; set; }

	public int Index { get; set; }

	public bool IsVr { get; set; }

	public string TourSlug { get; set; }
}