using Dapper;
using LocalEducation.Core.Constants;
using LocalEducation.Core.Dto;
using LocalEducation.Core.Queries;
using LocalEducation.Data.Contexts;
using LocalEducation.Services.EducationRepositories.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

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
		int totalCourses = await _context.Courses.CountAsync(cancellation);
		int totalTour = await _context.Tours.CountAsync(cancellation);
		int totalUsers = await _context.Users.CountAsync(cancellation);
		int totalViewCourse = await _context.Courses.Select(s => s.ViewCount).SumAsync(cancellation);
		int totalViewTour = await _context.Tours.Select(s => s.ViewCount).SumAsync(cancellation);

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
		System.Data.Common.DbCommand cmd = _context.Database.GetDbConnection().CreateCommand();

		cmd.CommandText = "[dbo].[GetCourseChart]";
		cmd.CommandType = CommandType.StoredProcedure;

		cmd.Parameters.Add(new SqlParameter("@StartDate", condition.StartDate.Date));
		cmd.Parameters.Add(new SqlParameter("@EndDate", condition.EndDate.Date.AddDays(1).AddSeconds(-1)));

		System.Data.Common.DbConnection connection = _context.Database.GetDbConnection();
		if (connection.State != ConnectionState.Open)
		{
			await connection.OpenAsync(cancellation);
		}

		await using System.Data.Common.DbDataReader reader = await cmd.ExecuteReaderAsync(cancellation);
		List<HighChartsData> courses = reader
			.Parse<HighChartsData>()
			.ToList();

		await reader.NextResultAsync(cancellation);

		List<HighChartsData> lessons = reader
			.Parse<HighChartsData>()
			.ToList();

		await reader.NextResultAsync(cancellation);

		List<HighChartsData> slides = reader
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
		System.Data.Common.DbCommand cmd = _context.Database.GetDbConnection().CreateCommand();

		cmd.CommandText = "[dbo].[GetTourChart]";
		cmd.CommandType = CommandType.StoredProcedure;

		cmd.Parameters.Add(new SqlParameter("@StartDate", condition.StartDate.Date));
		cmd.Parameters.Add(new SqlParameter("@EndDate", condition.EndDate.Date.AddDays(1).AddSeconds(-1)));

		System.Data.Common.DbConnection connection = _context.Database.GetDbConnection();
		if (connection.State != ConnectionState.Open)
		{
			await connection.OpenAsync(cancellation);
		}

		await using System.Data.Common.DbDataReader reader = await cmd.ExecuteReaderAsync(cancellation);

		List<HighChartsData> tours = reader
			.Parse<HighChartsData>()
			.ToList();

		await reader.NextResultAsync(cancellation);

		List<HighChartsData> scenes = reader
			.Parse<HighChartsData>()
			.ToList();

		await reader.NextResultAsync(cancellation);

		List<HighChartsData> infos = reader
			.Parse<HighChartsData>()
			.ToList();

		await reader.NextResultAsync(cancellation);

		List<HighChartsData> links = reader
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
		System.Data.Common.DbCommand cmd = _context.Database.GetDbConnection().CreateCommand();

		cmd.CommandText = "[dbo].[GetFilesChart]";
		cmd.CommandType = CommandType.StoredProcedure;

		cmd.Parameters.Add(new SqlParameter("@StartDate", condition.StartDate.Date));
		cmd.Parameters.Add(new SqlParameter("@EndDate", condition.EndDate.Date.AddDays(1).AddSeconds(-1)));

		System.Data.Common.DbConnection connection = _context.Database.GetDbConnection();
		if (connection.State != ConnectionState.Open)
		{
			await connection.OpenAsync(cancellation);
		}

		await using System.Data.Common.DbDataReader reader = await cmd.ExecuteReaderAsync(cancellation);

		List<HighChartsData> files = reader
			.Parse<HighChartsData>()
			.ToList();

		await connection.CloseAsync();

		foreach (HighChartsData data in files)
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