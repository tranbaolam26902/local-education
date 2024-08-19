namespace LocalEducation.WebApi.Models.AtlasModel;

public class AtlasEditModel
{
    public string Path { get; set; }

    public bool IsShowOnStartUp { get; set; }

    // ======================================================
    // Navigation properties
    // ======================================================

    public IList<PinEditModel> Pins { get; set; }
}

public class PinEditModel
{
    public float Top { get; set; }

    public float Left { get; set; }

    public int SceneIndex { get; set; }

    public string Title { get; set; }

    public string ThumbnailPath { get; set; }
}