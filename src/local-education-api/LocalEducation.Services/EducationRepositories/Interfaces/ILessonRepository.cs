using LocalEducation.Core.Dto;
using LocalEducation.Core.Entities;

namespace LocalEducation.Services.EducationRepositories.Interfaces;

public interface ILessonRepository
{
    #region Get data

    Task<IList<LessonItem>> GetLessonsByCourseIdAsync(Guid courseId, bool getAll = false, bool isManager = false, CancellationToken cancellationToken = default);

    Task<Lesson> GetLessonByIdAsync(Guid lessonId, bool getAll = false, CancellationToken cancellationToken = default);

    Task<bool> TogglePublicStatusAsync(Guid lessonId, CancellationToken cancellationToken = default);

    #endregion

    #region Add, Update & Delete

    Task<Lesson> AddOrUpdateLessonAsync(Lesson lesson, CancellationToken cancellationToken = default);

    Task<bool> DeleteLessonAsync(Guid lessonId, CancellationToken cancellationToken = default);

    #endregion
}