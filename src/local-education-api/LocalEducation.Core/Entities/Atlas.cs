using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Entities;

public class Atlas : IEntity
{
    public Guid Id { get; set; }

    public DateTime CreatedDate { get; set; }

    public string Path { get; set; }

    public bool IsShowOnStartUp { get; set; }

    // ======================================================
    // Navigation properties
    // ======================================================

    public IList<Pin> Pins { get; set; }

    public Tour Tour { get; set; }
}

public class Pin : IEntity
{
    public Guid Id { get; set; }

    public DateTime CreatedDate { get; set; }

    public float Top { get; set; }

    public float Left { get; set; }

    public int SceneIndex { get; set; }

    public string Title { get; set; }

    public string ThumbnailPath { get; set; }

    public Guid AtlasId { get; set; }

    // ======================================================
    // Navigation properties
    // ======================================================

    public Atlas Atlas { get; set; }
}