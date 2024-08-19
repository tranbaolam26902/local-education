using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Entities;

public class Slide : IEntity
{
    public Guid Id { get; set; }

    public DateTime CreatedDate { get; set; }

    public Guid LessonId { get; set; }

    public string Title { get; set; }

    public string Content { get; set; }

    public int Index { get; set; }

    public string Layout { get; set; }

    public string ThumbnailPath { get; set; }

    public string UrlPath { get; set; }

    public bool IsPublished { get; set; }

    public bool IsTest { get; set; }

    public int MinPoint { get; set; }

    // ======================================================
    // Navigation properties
    // ======================================================

    public Lesson Lesson { get; set; }

    public IList<Question> Questions { get; set; }

    public IList<ResultDetail> ResultDetails { get; set; }
}