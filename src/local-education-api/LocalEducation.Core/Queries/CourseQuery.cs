namespace LocalEducation.Core.Queries;

public class CourseQuery : ICourseQuery
{
    public string Keyword { get; set; } = "";

    public bool IsDeleted { get; set; } = false;
    
    public bool IsPublished { get; set; } = false;
    
    public bool NonPublished { get; set; } = false;

    public Guid UserId { get; set; } = Guid.Empty;

    public Guid AuthorId { get; set; } = Guid.Empty;
}