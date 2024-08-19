using LocalEducation.WebApi.Models.LessonModel;

namespace LocalEducation.WebApi.Models.CourseModel;

public class CourseDto
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Title { get; set; }

    public string UrlSlug { get; set; }

    public string Description { get; set; }

    public string ThumbnailPath { get; set; }

    public string UrlPath { get; set; }

    public DateTime CreatedDate { get; set; }

    public int ViewCount { get; set; }

    public bool IsDeleted { get; set; }

    public bool IsPublished { get; set; }

    public int TotalLesson { get; set; }



    // ======================================================
    // Navigation properties
    // ======================================================

    public IList<LessonDto> Lessons { get; set; }
}