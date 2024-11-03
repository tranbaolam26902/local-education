using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Entities;

public class Scene : IEntity
{
	public Guid Id { get; set; }

	public Guid TourId { get; set; }

	public int Index { get; set; }

	public string Title { get; set; }

	public DateTime CreatedDate { get; set; }

	public float X { get; set; }

	public float Y { get; set; }

	public float Z { get; set; }

	public string UrlPreview { get; set; }

	public string UrlImage { get; set; }


	// ======================================================
	// Navigation properties
	// ======================================================

	public Audio Audio { get; set; }

	public IList<LinkHotspot> LinkHotspots { get; set; }

	public IList<InfoHotspot> InfoHotspots { get; set; }

	public Tour Tour { get; set; }

	public Scene()
	{

	}

	public Scene(Guid id, Guid tourId, int index, string title, float x, float y, float z, string urlPreview, string urlImage)
	{
		Id = id;
		TourId = tourId;
		Index = index;
		Title = title;
		X = x;
		Y = y;
		Z = z;
		UrlPreview = urlPreview;
		UrlImage = urlImage;
	}
}

public class Audio
{
	public Guid Id { get; set; }

	public string Path { get; set; }

	public string ThumbnailPath { get; set; }

	public bool AutoPlay { get; set; }

	public bool LoopAudio { get; set; }

	// ======================================================
	// Navigation properties
	// ======================================================

	public Scene Scene { get; set; }
}