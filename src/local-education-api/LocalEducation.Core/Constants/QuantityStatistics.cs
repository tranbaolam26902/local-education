namespace LocalEducation.Core.Constants;

public class QuantityStatistics
{
    public int TotalCourses { get; set; }

    public int TotalTours { get; set; }

    public int TotalUsers { get; set; }

    public int TotalCourseViews { get; set; }

    public int TotalTourViews { get; set; }

}

public class HighChartsData
{   
    public string CreatedDate  { get; set; }

    public double Total { get; set; }

    public HighChartsData()
    {
        
    }

    public HighChartsData(string createdDate, double total)
    {
        CreatedDate = createdDate;
        Total = total;
    }
}
