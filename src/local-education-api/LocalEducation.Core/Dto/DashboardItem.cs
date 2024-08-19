using LocalEducation.Core.Constants;

namespace LocalEducation.Core.Dto;

public class CourseChartItem
{
    public IList<HighChartsData> Courses { get; set; }

    public IList<HighChartsData> Lessons { get; set; }

    public IList<HighChartsData> Slides { get; set; }
}

public class TourChartItem
{
    public IList<HighChartsData> Tours { get; set; }

    public IList<HighChartsData> Scenes { get; set; }

    public IList<HighChartsData> InfoHotspots { get; set; }

    public IList<HighChartsData> LinkHotspots { get; set; }

}

public class FileChartItem
{
    public IList<HighChartsData> Files { get; set; }

}