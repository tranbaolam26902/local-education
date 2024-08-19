using LocalEducation.Services.EducationRepositories.Interfaces;
using LocalEducation.Services.Extensions;
using Microsoft.EntityFrameworkCore;
using LocalEducation.Core.Contracts;
using LocalEducation.Data.Contexts;
using LocalEducation.Core.Entities;
using LocalEducation.Core.Queries;

namespace LocalEducation.Services.EducationRepositories;

public class CourseRepository : ICourseRepository
{
    private readonly LocalEducationDbContext _context;

    public CourseRepository(LocalEducationDbContext context)
    {
        _context = context;
    }

    #region Get data

    public async Task<Course> GetCourseByIdAsync(Guid courseId, bool getAll = false, CancellationToken cancellationToken = default)
    {
        var course = _context.Set<Course>();

        if (getAll)
        {
            return await course
                .Include(m => m.Lessons)
                .ThenInclude(l => l.Slides)
                .FirstOrDefaultAsync(s => s.Id == courseId, cancellationToken);
        }

        return await course
            .FirstOrDefaultAsync(s => s.Id == courseId, cancellationToken);
    }

    public async Task<Course> GetCourseBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var course = await _context.Set<Course>()
            .FirstOrDefaultAsync(c => c.UrlSlug == slug, cancellationToken);

        if (course == null)
        {
            return null;
        }

        var lessons = await _context.Set<Lesson>()
            .Include(l => l.Slides)
            .Where(l => l.CourseId == course.Id)
            .OrderBy(s => s.Index)
            .ToListAsync(cancellationToken);

        // order slides
        foreach (var lesson in lessons)
        {
            lesson.Slides = lesson.Slides.OrderBy(s => s.Index).ToList();
        }

        course.Lessons = lessons;
        return course;
    }

    public async Task<IList<Course>> GetRelatedCourses(int number, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Course>()
            .Include(c => c.Lessons)
            .Where(s => s.IsPublished)
            .OrderByDescending(c => c.ViewCount)
            .Take(number)
            .ToListAsync(cancellationToken);
    }

    public async Task<IPagedList<T>> GetPagedCoursesAsync<T>(
        ICourseQuery condition,
        IPagingParams pagingParams,
        Func<IQueryable<Course>, IQueryable<T>> mapper,
        CancellationToken cancellationToken = default)
    {
        var courses = FilterCourses(condition);

        var projectedCourses = mapper(courses);

        return await projectedCourses.ToPagedListAsync(pagingParams, cancellationToken);
    }

    public async Task<IList<Course>> GetCoursesByKeywordAsync(string keyword, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Course>()
            .WhereIf(!string.IsNullOrWhiteSpace(keyword), c => 
                c.Title.ToLower().Contains(keyword.ToLower()) || 
                c.UrlSlug.ToLower().Contains(keyword.ToLower()) || 
                c.Description.ToLower().Contains(keyword.ToLower()))
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> IsExistCourseBySlugAsync(Guid courseId, string slug, CancellationToken cancellation = default)
    {
        return await _context.Set<Course>()
            .AnyAsync(s => s.Id != courseId && s.UrlSlug == slug, cancellation);
    }

    #endregion

    #region Add or Update

    public async Task<Course> AddOrUpdateCourseAsync(Course course, CancellationToken cancellationToken = default)
    {
        if (course.Id == Guid.Empty)
        {
            course.CreatedDate = DateTime.Now;
            course.IsDeleted = false;
            course.ViewCount = 0;
            course.UrlSlug = course.Title.GenerateSlug();

            _context.Set<Course>().Add(course);
        }
        else
        {
            _context.Set<Course>().Update(course);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return course;
    }

    public async Task<bool> TakePartInCourseAsync(Guid courseId, Guid userId, CancellationToken cancellationToken = default)
    {

        if (await _context.Set<Progress>().AnyAsync(s => s.UserId == userId && s.CourseId == courseId, cancellationToken))
        {
            return false;
        }
        else
        {
            var progress = new Progress
            {
                CourseId = courseId,
                UserId = userId,
                Slides = "",
                CreatedDate = DateTime.Now
            };

            _context.Set<Progress>().Add(progress);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }

    public async Task IncreaseViewAsync(Guid courseId, CancellationToken cancellationToken = default)
    {
        await _context.Set<Course>()
            .Where(t => t.Id == courseId)
            .ExecuteUpdateAsync(p => p.SetProperty(x => x.ViewCount, x => x.ViewCount + 1), cancellationToken);
    }

    public async Task<bool> TogglePublicStatusAsync(Guid courseId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Course>()
            .Where(s => s.Id == courseId && !s.IsDeleted)
            .ExecuteUpdateAsync(t => t.SetProperty(s => s.IsPublished, x => !x.IsPublished), cancellationToken) > 0;
    }

    public async Task<bool> ToggleDeleteStatusAsync(Guid courseId, CancellationToken cancellationToken = default)
    {
        var course = await _context.Set<Course>()
            .FirstOrDefaultAsync(s => s.Id == courseId, cancellationToken);

        if (course != null)
        {
            course.IsDeleted = !course.IsDeleted;
            course.IsPublished = false;

            _context.Entry(course).State = EntityState.Modified;

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }

        return false;
    }

    public async Task<bool> DeleteCourseAsync(Guid courseId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Course>()
            .Where(s => s.Id == courseId)
            .ExecuteDeleteAsync(cancellationToken) > 0;
    }

    #endregion

    #region Private function

    private IQueryable<Course> FilterCourses(ICourseQuery condition)
    {
        return _context.Set<Course>()
            .Include(s => s.Progresses)
            .Include(c => c.Lessons)
            .WhereIf(condition.UserId != Guid.Empty, c =>
                c.Progresses.Any(p => p.UserId == condition.UserId) && c.IsPublished)
            .WhereIf(condition.AuthorId != Guid.Empty,
                c => c.UserId == condition.AuthorId)
            .WhereIf(condition.IsPublished, s => s.IsPublished)
            .WhereIf(condition.NonPublished, s => !s.IsPublished)
            .WhereIf(condition.IsDeleted, c => c.IsDeleted)
            .WhereIf(!condition.IsDeleted, c => !c.IsDeleted)
            .WhereIf(!string.IsNullOrWhiteSpace(condition.Keyword), c =>
                c.Title.ToLower().Contains(condition.Keyword.ToLower()) ||
                c.UrlSlug.ToLower().Contains(condition.Keyword.ToLower()) ||
                c.Description.ToLower().Contains(condition.Keyword.ToLower()));
    }

    #endregion
}