using LocalEducation.WebApi.Models.AtlasModel;
using LocalEducation.WebApi.Models.SceneModel;

namespace LocalEducation.WebApi.Models.TourModel;

public class TourDto
{
	public Guid Id { get; set; }

	public string Username { get; set; }

	public string Title { get; set; }

	public string UrlSlug { get; set; }

	public DateTime CreatedDate { get; set; }

	public int ViewCount { get; set; }

	public bool IsPublished { get; set; }

	public bool IsDeleted { get; set; }

	public string UrlPreview { get; set; }

	public IList<SceneDto> Scenes { get; set; }

	public AtlasDto Atlas { get; set; }
}