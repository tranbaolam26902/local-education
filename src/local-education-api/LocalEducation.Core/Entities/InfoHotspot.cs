using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Entities;

public class InfoHotspot : IEntity
{
	public Guid Id { get; set; }

	public DateTime CreatedDate { get; set; }

	public Guid SceneId { get; set; }

	public Guid LessonId { get; set; }

	public Guid InfoId { get; set; }

	public string Title { get; set; }

	public string Description { get; set; }

	public string Address { get; set; }

	public string ThumbnailPath { get; set; }

	public float X { get; set; }

	public float Y { get; set; }

	public float Z { get; set; }

	// ======================================================
	// Navigation properties
	// ======================================================

	public Scene Scene { get; set; }

	public InfoHotspot()
	{

	}

	public InfoHotspot(Guid id, Guid sceneId, string title, string description, string address, string thumbnailPath, float x, float y, float z)
	{
		Id = id;
		SceneId = sceneId;
		Title = title;
		Description = description;
		Address = address;
		ThumbnailPath = thumbnailPath;
		X = x;
		Y = y;
		Z = z;
	}
}