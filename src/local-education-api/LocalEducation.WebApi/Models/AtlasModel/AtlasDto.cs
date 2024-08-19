namespace LocalEducation.WebApi.Models.AtlasModel;

public class AtlasDto
{
    public Guid Id { get; set; }

    public string Path { get; set; }

    public bool IsShowOnStartUp { get; set; }

    // ======================================================
    // Navigation properties
    // ======================================================

    public IList<PinDto> Pins { get; set; }
}

public class PinDto
{
    public Guid Id { get; set; }

    public float Top { get; set; }

    public float Left { get; set; }

    public int SceneIndex { get; set; }

    public string Title { get; set; }

    public string ThumbnailPath { get; set; }

    public Guid AtlasId { get; set; }

}