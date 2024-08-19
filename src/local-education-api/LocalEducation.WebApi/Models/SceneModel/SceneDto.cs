using LocalEducation.WebApi.Models.AudioModel;
using LocalEducation.WebApi.Models.InfoHotspotModel;
using LocalEducation.WebApi.Models.LinkHotspotModel;

namespace LocalEducation.WebApi.Models.SceneModel;

public class SceneDto
{
	public Guid Id { get; set; }

	public Guid TourId { get; set; }

	public string Title { get; set; }

	public int Index { get; set; }

	public float X { get; set; }

	public float Y { get; set; }

	public float Z { get; set; }

	public string UrlPreview { get; set; }

	public string UrlImage { get; set; }

    public AudioDto Audio { get; set; }
	
	public IList<LinkHotspotDto> LinkHotspots { get; set; }

	public IList<InfoHotspotDto> InfoHotspots { get; set; }
}