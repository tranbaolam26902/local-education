using Dapper;
using System.Data;
using System.Data.Common;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using LocalEducation.Core.Dto;
using LocalEducation.Core.Queries;
using LocalEducation.Data.Contexts;
using LocalEducation.Core.Entities;
using LocalEducation.Core.Contracts;
using LocalEducation.Services.Extensions;
using LocalEducation.Services.EducationRepositories.Interfaces;

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
        var tour = await _context.Set<Tour>()
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
        var cmd = _context.Database.GetDbConnection().CreateCommand();

        cmd.CommandText = "[dbo].[GetTourBySlug]";
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add(new SqlParameter("@UrlSlug", slug ?? ""));

        var connection = _context.Database.GetDbConnection();
        if (connection.State != ConnectionState.Open)
            await connection.OpenAsync(cancellationToken);

        var reader = await cmd.ExecuteReaderAsync(cancellationToken);

        var tour = reader
            .Parse<Tour>()
            .FirstOrDefault();

        if (tour == null) return null;

        await reader.NextResultAsync(cancellationToken);

        tour.User = reader.Parse<User>()
            .FirstOrDefault();

        await reader.NextResultAsync(cancellationToken);

        tour.Scenes = reader.Parse<Scene>().ToList();

        await reader.NextResultAsync(cancellationToken);

        var infoList = reader.Parse<InfoHotspot>().ToList();

        await reader.NextResultAsync(cancellationToken);

        var linkList = reader.Parse<LinkHotspot>().ToList();

        tour.Atlas = await _context.Set<Atlas>()
            .Include(s => s.Pins)
            .FirstOrDefaultAsync(a => a.Id == tour.Id, cancellationToken);


        foreach (var scene in tour.Scenes)
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
        var scenes = tour.Scenes;

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var lowerKeyword = keyword.ToLower();

            scenes = tour.Scenes
                .Where(s =>
                {
                    var infoList = s.InfoHotspots
                        .Where(info =>
                            info.Title.ToLower().Contains(lowerKeyword) ||
                            info.Description.ToLower().Contains(lowerKeyword) ||
                            info.Address.ToLower().Contains(lowerKeyword))
                        .ToList();

                    var linkList = s.LinkHotspots
                        .Where(link =>
                            link.Title.ToLower().Contains(lowerKeyword))
                        .ToList();

                    var title = s.Title.ToLower().Contains(lowerKeyword);

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
        var cmd = _context.Database.GetDbConnection().CreateCommand();

        cmd.CommandText = "[dbo].[GetPagedTours]";
        cmd.CommandType = CommandType.StoredProcedure;

        if (userId != null)
            cmd.Parameters.Add(new SqlParameter("@UserId", userId.ToString()));

        AddTourCommonParameters(cmd, condition, pagingParams);

        SqlParameter outputParam = new("@TotalCount", SqlDbType.Int)
        {
            Direction = ParameterDirection.Output
        };

        cmd.Parameters.Add(outputParam);

        var connection = _context.Database.GetDbConnection();
        if (connection.State != ConnectionState.Open)
            await connection.OpenAsync(cancellationToken);

        var reader = await cmd.ExecuteReaderAsync(cancellationToken);
        var tours = reader
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
                foreach (var scene in tour.Scenes)
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
        var checkAtlas = await _context.Set<Atlas>().AnyAsync(a => a.Id == atlas.Id, cancellationToken);

        if (checkAtlas)
        {
            var oldAtlas = await _context.Set<Atlas>()
                .Include(s => s.Pins)
                .FirstOrDefaultAsync(a => a.Id == atlas.Id, cancellationToken);

            var newPins = atlas.Pins;
            var oldPins = oldAtlas.Pins.ToList();

            foreach (var pin in oldPins)
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
        var tour = await _context.Set<Tour>()
            .Include(s => s.Scenes)
            .ThenInclude(s => s.InfoHotspots)
            .FirstOrDefaultAsync(s => s.Id == tourId, cancellationToken);

        var oldScenes = tour.Scenes.ToList() ?? new List<Scene>();

        var oldLessonIds = _context.Scenes
            .Where(s => s.TourId == tourId && s.InfoHotspots != null)
            .SelectMany(s => s.InfoHotspots.Select(info => info.LessonId))
            .ToList();

        foreach (var scene in oldScenes)
        {
            tour.Scenes.Remove(scene);
        }

        foreach (var scene in scenes)
        {
            scene.TourId = tourId;

            if (scene.LinkHotspots != null)
            {
                foreach (var link in scene.LinkHotspots)
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
                foreach (var info in scene.InfoHotspots)
                {
                    info.CreatedDate = DateTime.Now;
                }
            }
        }

        var currentLessonIds = scenes
            .SelectMany(s => s.InfoHotspots.Select(info => info.LessonId))
            .ToList();

        var deletedLessonIds = oldLessonIds.Except(currentLessonIds).ToList();

        if (deletedLessonIds.Any())
        {
            foreach (var lessonId in deletedLessonIds)
            {
                var lesson = await _context.Set<Lesson>()
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
        var tour = await _context.Set<Tour>()
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
        var tour = await _context.Set<Tour>()
            .Include(s => s.Scenes)
            .FirstOrDefaultAsync(s => s.Id == tourId, cancellationToken);

        if (tour == null) return false;

        var lesson = await _context.Set<Lesson>()
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
        var tours = await _context.Set<Tour>()
            .Where(s => s.UserId == userId && s.IsDeleted)
            .ToListAsync(cancellationToken);

        foreach (var tour in tours)
        {
            var lesson = await _context.Set<Lesson>()
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