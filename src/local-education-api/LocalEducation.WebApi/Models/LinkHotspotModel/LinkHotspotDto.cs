namespace LocalEducation.WebApi.Models.LinkHotspotModel;

public class LinkHotspotDto
{
	public Guid Id { get; set; }

	public Guid SceneId { get; set; }

	public Guid LinkId { get; set; }

	public int SceneIndex { get; set; }

	public string Title { get; set; }

	public float X { get; set; }

	public float Y { get; set; }

	public float Z { get; set; }
}