using Dapper;
using LocalEducation.Core.Contracts;
using LocalEducation.Core.Dto;
using LocalEducation.Core.Entities;
using LocalEducation.Core.Queries;
using LocalEducation.Data.Contexts;
using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.Services.Extensions;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Data;
using System.Data.Common;

namespace LocalEducation.Services.EducationRepositories;

public class TourRepository : ITourRepository
{
	#region setup properties

	private readonly LocalEducationDbContext _context;

	private readonly IMemoryCache _memoryCache;

	#endregion

	public TourRepository(LocalEducationDbContext context, IMemoryCache memoryCache)
	{
		_context = context;
		_memoryCache = memoryCache;
	}

	#region Get data

	public async Task<Tour> GetTourByIdAsync(Guid tourId, bool getAll = false, CancellationToken cancellationToken = default)
	{
		Tour tour = await _context.Set<Tour>()
			.Include(s => s.Scenes)
			.Include(s => s.User)
			.FirstOrDefaultAsync(s => s.Id == tourId, cancellationToken);

		if (tour != null && getAll)
		{
			tour.Scenes = await _context.Set<Scene>()
				.Include(s => s.LinkHotspots)
				.Include(s => s.InfoHotspots)
				.Where(s => s.TourId == tourId)
				.OrderBy(s => s.Index)
				.ToListAsync(cancellationToken);
		}

		return tour;
	}

	public async Task<Tour> GetTourBySlugAsync(string slug, CancellationToken cancellationToken = default)
	{
		DbCommand cmd = _context.Database.GetDbConnection().CreateCommand();

		cmd.CommandText = "[dbo].[GetTourBySlug]";
		cmd.CommandType = CommandType.StoredProcedure;

		cmd.Parameters.Add(new SqlParameter("@UrlSlug", slug ?? ""));

		DbConnection connection = _context.Database.GetDbConnection();
		if (connection.State != ConnectionState.Open)
		{
			await connection.OpenAsync(cancellationToken);
		}

		DbDataReader reader = await cmd.ExecuteReaderAsync(cancellationToken);

		Tour tour = reader
			.Parse<Tour>()
			.FirstOrDefault();

		if (tour == null)
		{
			return null;
		}

		await reader.NextResultAsync(cancellationToken);

		tour.User = reader.Parse<User>()
			.FirstOrDefault();

		await reader.NextResultAsync(cancellationToken);

		tour.Scenes = reader.Parse<Scene>().ToList();

		await reader.NextResultAsync(cancellationToken);

		List<InfoHotspot> infoList = reader.Parse<InfoHotspot>().ToList();

		await reader.NextResultAsync(cancellationToken);

		List<LinkHotspot> linkList = reader.Parse<LinkHotspot>().ToList();

		tour.Atlas = await _context.Set<Atlas>()
			.Include(s => s.Pins)
			.FirstOrDefaultAsync(a => a.Id == tour.Id, cancellationToken);


		foreach (Scene scene in tour.Scenes)
		{
			scene.InfoHotspots = infoList.Where(s => s.SceneId == scene.Id).ToList();
			scene.LinkHotspots = linkList.Where(s => s.SceneId == scene.Id).ToList();
			scene.Audio = await _context.Set<Audio>()
				.FirstOrDefaultAsync(a => a.Id == scene.Id, cancellationToken);
		}

		await connection.CloseAsync();

		return tour;
	}

	public Task<Scene> GetSceneByIdAsync(Guid sceneId, CancellationToken cancellationToken = default)
	{
		return _context.Set<Scene>()
			.Include(s => s.Tour)
			.FirstOrDefaultAsync(s => s.Id == sceneId, cancellationToken);
	}

	public async Task<Tour> GetTourIsDeletedAsync(Guid tourId, CancellationToken cancellationToken = default)
	{
		return await _context.Set<Tour>()
			.FirstOrDefaultAsync(s => s.Id == tourId && s.IsDeleted, cancellationToken);
	}

	public async Task<Scene> UpdateSceneAsync(Scene scene, CancellationToken cancellationToken = default)
	{
		_context.Entry(scene).State = EntityState.Modified;
		await _context.SaveChangesAsync(cancellationToken);
		return scene;
	}

	public async Task<IList<Scene>> GetSceneByQueryAsync(Tour tour, string keyword, CancellationToken cancellationToken = default)
	{
		IList<Scene> scenes = tour.Scenes;

		if (!string.IsNullOrWhiteSpace(keyword))
		{
			string lowerKeyword = keyword.ToLower();

			scenes = tour.Scenes
				.Where(s =>
				{
					List<InfoHotspot> infoList = s.InfoHotspots
						.Where(info =>
							info.Title.ToLower().Contains(lowerKeyword) ||
							info.Description.ToLower().Contains(lowerKeyword) ||
							info.Address.ToLower().Contains(lowerKeyword))
						.ToList();

					List<LinkHotspot> linkList = s.LinkHotspots
						.Where(link =>
							link.Title.ToLower().Contains(lowerKeyword))
						.ToList();

					bool title = s.Title.ToLower().Contains(lowerKeyword);

					return linkList.Count > 0 || infoList.Count > 0 || title;
				})
				.Select(scene =>
				{
					scene.LinkHotspots = scene.LinkHotspots
						.Where(s => s.Title.ToLower().Contains(lowerKeyword))
						.ToList();

					scene.InfoHotspots = scene.InfoHotspots
						.Where(s =>
							s.Title.ToLower().Contains(lowerKeyword) ||
							s.Description.ToLower().Contains(lowerKeyword) ||
							s.Address.ToLower().Contains(lowerKeyword))
						.ToList();

					return scene;
				})
				.ToList();
			await Task.WhenAll();
		}

		return scenes;
	}

	public async Task<IPagedList<TourItem>> GetPagedToursAsync(
		TourQuery condition,
		IPagingParams pagingParams,
		Guid? userId = null,
		CancellationToken cancellationToken = default)
	{
		DbCommand cmd = _context.Database.GetDbConnection().CreateCommand();

		cmd.CommandText = "[dbo].[GetPagedTours]";
		cmd.CommandType = CommandType.StoredProcedure;

		if (userId != null)
		{
			cmd.Parameters.Add(new SqlParameter("@UserId", userId.ToString()));
		}

		AddTourCommonParameters(cmd, condition, pagingParams);

		SqlParameter outputParam = new("@TotalCount", SqlDbType.Int)
		{
			Direction = ParameterDirection.Output
		};

		cmd.Parameters.Add(outputParam);

		DbConnection connection = _context.Database.GetDbConnection();
		if (connection.State != ConnectionState.Open)
		{
			await connection.OpenAsync(cancellationToken);
		}

		DbDataReader reader = await cmd.ExecuteReaderAsync(cancellationToken);
		List<TourItem> tours = reader
			.Parse<TourItem>()
			.ToList();

		await reader.NextResultAsync(cancellationToken);

		int totalCount = (int)outputParam.Value;

		await connection.CloseAsync();

		return await tours.ToPagedListAsync(pagingParams, totalCount);
	}

	public async Task<Tour> GetCachedTourBySlugAsync(
		string slug, CancellationToken cancellationToken = default)
	{
		return await _memoryCache.GetOrCreateAsync(
			$"tour.by-slug.{slug}",
			async (entry) =>
			{
				entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
				return await GetTourBySlugAsync(slug, cancellationToken);
			});
	}

	public async Task<bool> IsExistTourSlugAsync(Guid tourId, string slug, CancellationToken cancellationToken = default)
	{
		return await _context.Set<Tour>()
			.AnyAsync(t => t.Id != tourId && t.UrlSlug == slug, cancellationToken);
	}

	#endregion

	#region Add, Update & Delete

	public async Task<Tour> AddOrUpdateTourAsync(Tour tour, CancellationToken cancellationToken = default)
	{
		if (await _context.Set<Tour>().AnyAsync(t => t.Id == tour.Id, cancellationToken))
		{
			tour.UrlSlug = tour.Title.GenerateSlug();

			_context.Entry(tour).State = EntityState.Modified;
		}
		else
		{
			tour.UrlSlug = tour.Title.GenerateSlug();
			tour.CreatedDate = DateTime.Now;
			tour.User = null;

			if (tour.Scenes != null)
			{
				foreach (Scene scene in tour.Scenes)
				{
					scene.CreatedDate = DateTime.Now;

					// Null check for LinkHotspots
				}
			}

			_context.Tours.Add(tour);
		}

		await _context.SaveChangesAsync(cancellationToken);
		return tour;
	}

	public async Task<Atlas> AddOrUpdateAtlasAsync(Atlas atlas, CancellationToken cancellationToken = default)
	{
		bool checkAtlas = await _context.Set<Atlas>().AnyAsync(a => a.Id == atlas.Id, cancellationToken);

		if (checkAtlas)
		{
			Atlas oldAtlas = await _context.Set<Atlas>()
				.Include(s => s.Pins)
				.FirstOrDefaultAsync(a => a.Id == atlas.Id, cancellationToken);

			IList<Pin> newPins = atlas.Pins;
			List<Pin> oldPins = oldAtlas.Pins.ToList();

			foreach (Pin pin in oldPins)
			{
				oldAtlas.Pins.Remove(pin);
			}

			oldAtlas.Pins = newPins;
			oldAtlas.Path = atlas.Path;
			oldAtlas.IsShowOnStartUp = atlas.IsShowOnStartUp;

			_context.Entry(oldAtlas).State = EntityState.Modified;
		}
		else
		{
			_context.Atlases.Add(atlas);
		}

		await _context.SaveChangesAsync(cancellationToken);
		return atlas;
	}

	public async Task<Tour> AddOrUpdatesSceneAsync(Guid tourId, IList<Scene> scenes, CancellationToken cancellationToken = default)
	{
		Tour tour = await _context.Set<Tour>()
			.Include(s => s.Scenes)
			.ThenInclude(s => s.InfoHotspots)
			.FirstOrDefaultAsync(s => s.Id == tourId, cancellationToken);

		List<Scene> oldScenes = tour.Scenes.ToList() ?? [];

		List<Guid> oldLessonIds = _context.Scenes
			.Where(s => s.TourId == tourId && s.InfoHotspots != null)
			.SelectMany(s => s.InfoHotspots.Select(info => info.LessonId))
			.ToList();

		foreach (Scene scene in oldScenes)
		{
			tour.Scenes.Remove(scene);
		}

		foreach (Scene scene in scenes)
		{
			scene.TourId = tourId;

			if (scene.LinkHotspots != null)
			{
				foreach (LinkHotspot link in scene.LinkHotspots)
				{
					if (link != null)
					{
						// Set link hotspot created date
						link.CreatedDate = DateTime.Now;
					}
				}
			}

			// Null check for InfoHotspots
			if (scene.InfoHotspots != null)
			{
				foreach (InfoHotspot info in scene.InfoHotspots)
				{
					info.CreatedDate = DateTime.Now;
				}
			}
		}

		List<Guid> currentLessonIds = scenes
			.SelectMany(s => s.InfoHotspots.Select(info => info.LessonId))
			.ToList();

		List<Guid> deletedLessonIds = oldLessonIds.Except(currentLessonIds).ToList();

		if (deletedLessonIds.Any())
		{
			foreach (Guid lessonId in deletedLessonIds)
			{
				Lesson lesson = await _context.Set<Lesson>()
					.FirstOrDefaultAsync(l => l.Id == lessonId, cancellationToken);

				if (lesson != null)
				{
					lesson.TourSlug = "";
					lesson.IsVr = false;

					_context.Entry(lesson).State = EntityState.Modified;
				}

			}
		}

		_context.Scenes.AddRange(scenes);

		await _context.SaveChangesAsync(cancellationToken);

		return tour;
	}

	public async Task<Scene> SetImageSceneAsync(Scene scene, string urlImage, string urlPreview, CancellationToken cancellationToken = default)
	{
		scene.UrlImage = urlImage;
		scene.UrlPreview = urlPreview;

		_context.Entry(scene).State = EntityState.Modified;
		await _context.SaveChangesAsync(cancellationToken);

		return scene;
	}

	public async Task<bool> TogglePublicStatusAsync(Guid tourId, CancellationToken cancellationToken = default)
	{
		return await _context.Set<Tour>()
			.Where(s => s.Id == tourId && !s.IsDeleted)
			.ExecuteUpdateAsync(t => t.SetProperty(s => s.IsPublished, x => !x.IsPublished), cancellationToken) > 0;
	}

	public async Task<bool> ToggleDeleteStatusAsync(Guid tourId, CancellationToken cancellationToken = default)
	{
		Tour tour = await _context.Set<Tour>()
			.FirstOrDefaultAsync(s => s.Id == tourId, cancellationToken);

		if (tour != null)
		{
			tour.IsDeleted = !tour.IsDeleted;
			tour.IsPublished = false;

			_context.Entry(tour).State = EntityState.Modified;

			await _context.SaveChangesAsync(cancellationToken);

			return true;
		}

		return false;
	}

	public async Task<bool> DeleteTourAsync(Guid tourId, CancellationToken cancellationToken = default)
	{
		Tour tour = await _context.Set<Tour>()
			.Include(s => s.Scenes)
			.FirstOrDefaultAsync(s => s.Id == tourId, cancellationToken);

		if (tour == null)
		{
			return false;
		}

		Lesson lesson = await _context.Set<Lesson>()
			.FirstOrDefaultAsync(l => l.TourSlug == tour.UrlSlug, cancellationToken);

		if (lesson != null)
		{
			lesson.TourSlug = "";
			lesson.IsVr = false;

			_context.Entry(lesson).State = EntityState.Modified;
		}

		_context.Tours.Remove(tour);

		await _context.SaveChangesAsync(cancellationToken);
		return true;
	}

	public async Task<bool> EmptyRecycleBinAsync(Guid userId, CancellationToken cancellationToken = default)
	{
		List<Tour> tours = await _context.Set<Tour>()
			.Where(s => s.UserId == userId && s.IsDeleted)
			.ToListAsync(cancellationToken);

		foreach (Tour tour in tours)
		{
			Lesson lesson = await _context.Set<Lesson>()
				.FirstOrDefaultAsync(l => l.TourSlug == tour.UrlSlug, cancellationToken);

			if (lesson != null)
			{
				lesson.TourSlug = "";
				lesson.IsVr = false;

				_context.Entry(lesson).State = EntityState.Modified;
			}
		}

		_context.Tours.RemoveRange(tours);

		await _context.SaveChangesAsync(cancellationToken);

		return true;
	}

	public async Task IncreaseViewAsync(Guid tourId, CancellationToken cancellationToken = default)
	{
		await _context.Set<Tour>()
			.Where(t => t.Id == tourId)
			.ExecuteUpdateAsync(p => p.SetProperty(x => x.ViewCount, x => x.ViewCount + 1), cancellationToken);
	}

	#endregion

	#region private function

	private static void AddTourCommonParameters(DbCommand cmd, ITourQuery condition, IPagingParams pagingParams)
	{
		cmd.Parameters.Add(new SqlParameter("@Keyword", condition.Keyword ?? ""));
		cmd.Parameters.Add(new SqlParameter("@AuthorName", condition.AuthorName ?? ""));
		cmd.Parameters.Add(new SqlParameter("@IsDeleted", condition.IsDeleted));
		cmd.Parameters.Add(new SqlParameter("@IsPublished", condition.IsPublished));
		cmd.Parameters.Add(new SqlParameter("@NonPublished", condition.NonPublished));
		cmd.Parameters.Add(new SqlParameter("@PageIndex", pagingParams.PageNumber ?? 1));
		cmd.Parameters.Add(new SqlParameter("@PageSize", pagingParams.PageSize ?? 10));
		cmd.Parameters.Add(new SqlParameter("@OrderBy", pagingParams.SortColumn ?? "CreatedDate"));
		cmd.Parameters.Add(new SqlParameter("@OrderDirection", pagingParams.SortOrder?.ToLower() ?? "desc"));
	}

	#endregion
}