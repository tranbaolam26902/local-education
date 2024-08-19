namespace LocalEducation.WebApi.Models.CourseModel;

public class CourseFilterByUser : PagingModel
{
    public string Keyword { get; set; } = "";
}

public class CourseFilterModel : CourseFilterByUser
{
    public bool? IsDeleted { get; set; } = false;

    public bool? IsPublished { get; set; } = false;

    public bool? NonPublished { get; set; } = false;
}

public class CourseFilter
{
    public string Keyword { get; set; }
}