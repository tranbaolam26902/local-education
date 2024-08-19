using LocalEducation.Core.Constants;
using LocalEducation.Core.Dto;
using LocalEducation.Core.Queries;
using LocalEducation.Data.Contexts;
using LocalEducation.Services.EducationRepositories.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Dapper;

namespace LocalEducation.Services.EducationRepositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly LocalEducationDbContext _context;

    public DashboardRepository(LocalEducationDbContext context)
    {
        _context = context;
    }

    public async Task<QuantityStatistics> GetTotalQuantityStatisticsAsync(CancellationToken cancellation = default)
    {
        var totalCourses = await _context.Courses.CountAsync(cancellation);
        var totalTour = await _context.Tours.CountAsync(cancellation);
        var totalUsers = await _context.Users.CountAsync(cancellation);
        var totalViewCourse = await _context.Courses.Select(s => s.ViewCount).SumAsync(cancellation);
        var totalViewTour = await _context.Tours.Select(s => s.ViewCount).SumAsync(cancellation);

        return new QuantityStatistics
        {
            TotalCourses = totalCourses,
            TotalTours = totalTour,
            TotalUsers = totalUsers,
            TotalCourseViews = totalViewCourse,
            TotalTourViews = totalViewTour
        };
    }

    public async Task<CourseChartItem> GetCourseChartStatisticsAsync(IDashboardQuery condition, CancellationToken cancellation = default)
    {
        var cmd = _context.Database.GetDbConnection().CreateCommand();

        cmd.CommandText = "[dbo].[GetCourseChart]";
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add(new SqlParameter("@StartDate", condition.StartDate.Date));
        cmd.Parameters.Add(new SqlParameter("@EndDate", condition.EndDate.Date.AddDays(1).AddSeconds(-1)));

        var connection = _context.Database.GetDbConnection();
        if (connection.State != ConnectionState.Open)
        {
            await connection.OpenAsync(cancellation);
        }

        await using var reader = await cmd.ExecuteReaderAsync(cancellation);
        var courses = reader
            .Parse<HighChartsData>()
            .ToList();

        await reader.NextResultAsync(cancellation);

        var lessons = reader
            .Parse<HighChartsData>()
            .ToList();

        await reader.NextResultAsync(cancellation);

        var slides = reader
            .Parse<HighChartsData>()
            .ToList();

        await connection.CloseAsync();
            

        return new CourseChartItem
        {
            Courses = courses,
            Lessons = lessons,
            Slides = slides
        };
    }

    public async Task<TourChartItem> GetTourChartStatisticsAsync(IDashboardQuery condition, CancellationToken cancellation = default)
    {
        var cmd = _context.Database.GetDbConnection().CreateCommand();

        cmd.CommandText = "[dbo].[GetTourChart]";
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add(new SqlParameter("@StartDate", condition.StartDate.Date));
        cmd.Parameters.Add(new SqlParameter("@EndDate", condition.EndDate.Date.AddDays(1).AddSeconds(-1)));

        var connection = _context.Database.GetDbConnection();
        if (connection.State != ConnectionState.Open)
        {
            await connection.OpenAsync(cancellation);
        }

        await using var reader = await cmd.ExecuteReaderAsync(cancellation);

        var tours = reader
            .Parse<HighChartsData>()
            .ToList();

        await reader.NextResultAsync(cancellation);

        var scenes = reader
            .Parse<HighChartsData>()
            .ToList();

        await reader.NextResultAsync(cancellation);

        var infos = reader
            .Parse<HighChartsData>()
            .ToList();

        await reader.NextResultAsync(cancellation);

        var links = reader
            .Parse<HighChartsData>()
            .ToList();

        await connection.CloseAsync();

        return new TourChartItem
        {
            Tours = tours,
            Scenes = scenes,
            InfoHotspots = infos,
            LinkHotspots = links
        };
    }

    public async Task<FileChartItem> GetFileChartStatisticsAsync(IDashboardQuery condition, CancellationToken cancellation = default)
    {
        var cmd = _context.Database.GetDbConnection().CreateCommand();

        cmd.CommandText = "[dbo].[GetFilesChart]";
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add(new SqlParameter("@StartDate", condition.StartDate.Date));
        cmd.Parameters.Add(new SqlParameter("@EndDate", condition.EndDate.Date.AddDays(1).AddSeconds(-1)));

        var connection = _context.Database.GetDbConnection();
        if (connection.State != ConnectionState.Open)
        {
            await connection.OpenAsync(cancellation);
        }

        await using var reader = await cmd.ExecuteReaderAsync(cancellation);

        var files = reader
            .Parse<HighChartsData>()
            .ToList();

        await connection.CloseAsync();

        foreach (var data in files)
        {
            // convert byte to MB, and round to 2 decimal places

            data.Total = Math.Round(data.Total / (1024 * 1024), 2);
        }

        return new FileChartItem
        {
            Files = files
        };
    }
}