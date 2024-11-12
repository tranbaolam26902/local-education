namespace LocalEducation.WebApi.Models.InfoHotspotModel;

public class InfoHotspotEditModel
{
	public Guid InfoId { get; set; }

	public string Title { get; set; }

	public string Content { get; set; }

	public string Description { get; set; }

	public Guid LessonId { get; set; }

	public string Address { get; set; }

	public string UrlImage { get; set; }

	public float X { get; set; }

	public float Y { get; set; }

	public float Z { get; set; }
}