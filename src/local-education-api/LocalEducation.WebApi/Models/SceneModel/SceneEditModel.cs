using LocalEducation.WebApi.Models.AudioModel;
using LocalEducation.WebApi.Models.InfoHotspotModel;
using LocalEducation.WebApi.Models.LinkHotspotModel;

namespace LocalEducation.WebApi.Models.SceneModel;

public class SceneEditModel
{
	public int Index { get; set; }

	public string Title { get; set; }

	public float X { get; set; }

	public float Y { get; set; }

	public float Z { get; set; }

	public string UrlPreview { get; set; }

	public string UrlImage { get; set; }

	public IList<LinkHotspotEditModel> LinkHotspots { get; set; } = [];

	public IList<InfoHotspotEditModel> InfoHotspots { get; set; } = [];

	public AudioEditModel Audio { get; set; }
}