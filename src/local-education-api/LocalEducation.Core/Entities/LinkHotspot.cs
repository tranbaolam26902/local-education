using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Entities;

public class LinkHotspot : IEntity
{
	public Guid Id { get; set; }

	public Guid SceneId { get; set; }

	public DateTime CreatedDate { get; set; }

	public int SceneIndex { get; set; }

	public Guid LinkId { get; set; }

	public string Title { get; set; }

	public float X { get; set; }

	public float Y { get; set; }

	public float Z { get; set; }

	// ======================================================
	// Navigation properties
	// ======================================================

	public Scene Scene { get; set; }

	public LinkHotspot()
	{

	}

	public LinkHotspot(Guid id, Guid sceneId, int sceneIndex, Guid linkId, string title, float x, float y, float z)
	{
		Id = id;
		SceneId = sceneId;
		SceneIndex = sceneIndex;
		LinkId = linkId;
		Title = title;
		X = x;
		Y = y;
		Z = z;
	}
}