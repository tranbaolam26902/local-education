using LocalEducation.Core.Contracts;
using LocalEducation.Core.Entities;
using LocalEducation.Core.Queries;

namespace LocalEducation.Services.EducationRepositories.Interfaces;

public interface ICourseRepository
{
    #region Get Data
    
    Task<Course> GetCourseByIdAsync(Guid courseId, bool getAll = false, CancellationToken cancellationToken = default);

    Task<Course> GetCourseBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<IList<Course>> GetRelatedCourses(int number, CancellationToken cancellationToken = default);

    Task<IPagedList<T>> GetPagedCoursesAsync<T>(
        ICourseQuery condition,
        IPagingParams pagingParams,
        Func<IQueryable<Course>, IQueryable<T>> mapper,
        CancellationToken cancellationToken = default);

    Task<IList<Course>> GetCoursesByKeywordAsync(string keyword, CancellationToken cancellationToken = default);

    Task<bool> IsExistCourseBySlugAsync(Guid courseId, string slug, CancellationToken cancellation = default);

    #endregion

    #region Add, Update & Delete

    Task<Course> AddOrUpdateCourseAsync(Course course, CancellationToken cancellationToken = default);
    
    Task<bool> TakePartInCourseAsync(Guid courseId, Guid userId, CancellationToken cancellationToken = default);

    Task IncreaseViewAsync(Guid courseId, CancellationToken cancellationToken = default);

    Task<bool> TogglePublicStatusAsync(Guid courseId, CancellationToken cancellationToken = default);

    Task<bool> ToggleDeleteStatusAsync(Guid courseId, CancellationToken cancellationToken = default);

    Task<bool> DeleteCourseAsync(Guid courseId, CancellationToken cancellationToken = default);

    #endregion
}