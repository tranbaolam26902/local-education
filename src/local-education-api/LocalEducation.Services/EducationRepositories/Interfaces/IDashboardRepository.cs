using LocalEducation.Core.Constants;
using LocalEducation.Core.Dto;
using LocalEducation.Core.Queries;

namespace LocalEducation.Services.EducationRepositories.Interfaces;

public interface IDashboardRepository
{
    Task<QuantityStatistics> GetTotalQuantityStatisticsAsync(CancellationToken cancellation = default);

    Task<CourseChartItem> GetCourseChartStatisticsAsync(IDashboardQuery condition, CancellationToken cancellation = default);

    Task<TourChartItem> GetTourChartStatisticsAsync(IDashboardQuery condition, CancellationToken cancellation = default);

    Task<FileChartItem> GetFileChartStatisticsAsync(IDashboardQuery condition, CancellationToken cancellation = default);
}