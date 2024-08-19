namespace LocalEducation.WebApi.Models.SlideModel;

public class SlideDto
{
    public Guid Id { get; set; }

    public Guid LessonId { get; set; }

    public string Title { get; set; }

    public string Content { get; set; }

    public string Layout { get; set; }

    public int Index { get; set; }

    public string ThumbnailPath { get; set; }

    public string UrlPath { get; set; }

    public bool IsPublished { get; set; }

    public bool IsTest { get; set; }

    public int MinPoint { get; set; }
}