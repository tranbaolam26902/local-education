using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Entities;

public class Course : IEntity
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

    public bool IsLockedProgress { get; set; }

    public bool IsPublished { get; set; }

    public bool IsDeleted { get; set; }

    // ======================================================
    // Navigation properties
    // ======================================================

    public IList<Lesson> Lessons { get; set; }

    public IList<Progress> Progresses { get; set; }
}