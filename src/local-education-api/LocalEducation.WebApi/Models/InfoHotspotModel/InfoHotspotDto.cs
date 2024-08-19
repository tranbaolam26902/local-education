namespace LocalEducation.WebApi.Models.InfoHotspotModel;

public class InfoHotspotDto
{
    public Guid Id { get; set; }

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
}