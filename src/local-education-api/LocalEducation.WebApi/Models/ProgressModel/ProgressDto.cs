using LocalEducation.Core.Constants;

namespace LocalEducation.WebApi.Models.ProgressModel;

public class ProgressDto
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid CourseId { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public string UrlSlug { get; set; }

    public string UrlPath { get; set; }

    public string ThumbnailPath { get; set; }

    public double Completed { get; set; }

    public IList<SlideProgress> Slides { get; set; }
}