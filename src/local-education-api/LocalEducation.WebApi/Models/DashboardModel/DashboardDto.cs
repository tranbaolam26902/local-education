namespace LocalEducation.WebApi.Models.DashboardModel;

public class DashboardDto
{
    public int Time { get; set; }

    public int Count { get; set; }

}

public class QuantityStatisticsDto
{
    public int TotalCourses { get; set; }

    public int TotalTours { get; set; }

    public int TotalUsers { get; set; }

    public int TotalCourseViews { get; set; }

    public int TotalTourViews { get; set; }
}