using LocalEducation.Core.Contracts;
using LocalEducation.Core.Entities;

namespace LocalEducation.Core.Dto;

public class CourseItem : IEntity
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

    public int TotalLesson { get; set; }
}