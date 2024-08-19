using File = LocalEducation.Core.Entities.File;
using LocalEducation.Core.Contracts;
using LocalEducation.Core.Entities;
using LocalEducation.Core.Queries;
using LocalEducation.Core.Dto;

namespace LocalEducation.Services.EducationRepositories.Interfaces;

public interface IFileRepository
{
    #region Get Data

    Task<IPagedList<T>> GetPagedFilesAsync<T>(
        Guid userId,
        FileQuery condition,
        IPagingParams pagingParams,
        Func<IQueryable<File>, IQueryable<T>> mapper,
        CancellationToken cancellationToken = default);

    Task<IList<FolderItem>> GetFoldersAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<File> GetFileByIdAsync(
        Guid fileId,
        CancellationToken cancellationToken = default);

    Task<bool> CheckExistsFolderAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<bool> CheckAuthorizeFileAsync(
        Guid userId,
        Guid fileId,
        CancellationToken cancellationToken = default);

    Task<Folder> GetFolderByUserIdAsync(
        Guid userId,
        FileType fileType,
        CancellationToken cancellationToken = default);

    Task<File> GetFileIsDeletedAsync(Guid fileId, CancellationToken cancellationToken = default);

    Task<IList<File>> GetFilesIsDeletedAsync(Guid userId, CancellationToken cancellationToken = default);

    #endregion

    #region Add or Update

    Task<Folder> AddOrUpdateFolderAsync(
        User user,
        Folder folder,
        CancellationToken cancellationToken = default);

    Task<File> AddOrUpdateFileAsync(
        File file,
        CancellationToken cancellationToken = default);

    Task ActivateCloudStorageAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    #endregion

    #region Delete

    Task<bool> ToggleDeleteFilesStatusAsync(Guid fileId, CancellationToken cancellationToken = default);

    Task<bool> DeleteFileAsync(Guid fileId, CancellationToken cancellationToken = default);

    #endregion
}