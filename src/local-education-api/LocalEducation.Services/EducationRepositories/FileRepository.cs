using LocalEducation.Services.EducationRepositories.Interfaces;
using File = LocalEducation.Core.Entities.File;
using LocalEducation.Services.Extensions;
using Microsoft.EntityFrameworkCore;
using LocalEducation.Core.Contracts;
using LocalEducation.Core.Entities;
using LocalEducation.Data.Contexts;
using LocalEducation.Core.Queries;
using LocalEducation.Core.Dto;

namespace LocalEducation.Services.EducationRepositories;

public class FileRepository : IFileRepository
{
    private readonly LocalEducationDbContext _context;

    public FileRepository(LocalEducationDbContext context)
    {
        this._context = context;
    }

    #region Get Data

    public async Task<IPagedList<T>> GetPagedFilesAsync<T>(
        Guid userId,
        FileQuery condition,
        IPagingParams pagingParams,
        Func<IQueryable<File>, IQueryable<T>> mapper,
        CancellationToken cancellationToken = default)
    {
        var files = _context.Set<File>()
            .Include(s => s.Folder)
            .Where(s => s.Folder.UserId == userId)
            .WhereIf(condition.IsDeleted, s => s.IsDeleted)
            .WhereIf(!condition.IsDeleted, s => !s.IsDeleted)
            .WhereIf(condition.FolderId != Guid.Empty,
                s => s.FolderId == condition.FolderId)
            .WhereIf(!string.IsNullOrWhiteSpace(condition.Keyword), s =>
                s.Name.ToLower().Contains(condition.Keyword.ToLower()) ||
                s.Folder.Name.ToLower().Contains(condition.Keyword.ToLower()) ||
                s.Folder.Slug.ToLower().Contains(condition.Keyword.ToLower()));

        var projectedFiles = mapper(files);

        return await projectedFiles.ToPagedListAsync(pagingParams, cancellationToken);
    }

    public async Task<IList<FolderItem>> GetFoldersAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var folders = await _context.Set<Folder>()
            .Include(s => s.Files)
            .Where(s => s.UserId == userId)
            .ToListAsync(cancellationToken);

        return folders.Select(s => new FolderItem(s)).ToList();
    }

    public Task<File> GetFileByIdAsync(Guid fileId, CancellationToken cancellationToken = default)
    {
        return _context.Set<File>()
            .Include(s => s.Folder)
            .FirstOrDefaultAsync(s => s.Id == fileId, cancellationToken);
    }

    public async Task<bool> CheckExistsFolderAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Folder>()
            .AnyAsync(s => s.UserId == userId, cancellationToken);
    }

    public async Task<bool> CheckAuthorizeFileAsync(Guid userId, Guid fileId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<File>()
            .AnyAsync(s => s.Folder.UserId == userId && s.Id == fileId, cancellationToken);
    }

    public async Task<Folder> GetFolderByUserIdAsync(Guid userId, FileType fileType, CancellationToken cancellationToken = default)
    {
        var folders = await _context.Set<Folder>()
            .Where(s => s.UserId == userId)
            .ToListAsync(cancellationToken);

        if (fileType == FileType.Image || fileType == FileType.Panorama)
        {
            return folders.FirstOrDefault(s => s.Slug.ToLower().Equals("images"));
        }

        if (fileType == FileType.Audio)
        {
            return folders.FirstOrDefault(s => s.Slug.ToLower().Equals("audios"));
        }

        if (fileType == FileType.Video)
        {
            return folders.FirstOrDefault(s => s.Slug.ToLower().Equals("videos"));
        }

        return folders.FirstOrDefault(s => s.Slug.ToLower().Equals("others"));
    }

    public async Task<File> GetFileIsDeletedAsync(Guid fileId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<File>()
            .Include(s => s.Folder)
            .FirstOrDefaultAsync(s => s.IsDeleted && s.Id == fileId, cancellationToken);
    }

    public async Task<IList<File>> GetFilesIsDeletedAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<File>()
            .Include(s => s.Folder)
            .Where(s => s.IsDeleted && s.Folder.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    #endregion

    #region Add or Update

    public Task<Folder> AddOrUpdateFolderAsync(User user, Folder folder, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async Task<File> AddOrUpdateFileAsync(File file, CancellationToken cancellationToken = default)
    {
        if (file.Id == Guid.Empty)
        {

            file.CreatedDate = DateTime.Now;
            file.IsDeleted = false;
            _context.Files.Add(file);
        }
        else
        {
            _context.Files.Update(file);
        }
        await _context.SaveChangesAsync(cancellationToken);
        return file;
    }

    public async Task ActivateCloudStorageAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var folders = new List<Folder>()
        {
            new()
            {
                UserId = userId,
                CreatedDate = DateTime.Now,
                Name = "Hình ảnh",
                Slug = "images",
                IsDeleted = false
            },
            new()
            {
                UserId = userId,
                CreatedDate = DateTime.Now,
                Name = "Âm thanh",
                Slug = "audios",
                IsDeleted = false
            },
            new()
            {
                UserId = userId,
                CreatedDate = DateTime.Now,
                Name = "Video",
                Slug = "videos",
                IsDeleted = false
            },
            new()
            {
                UserId = userId,
                CreatedDate = DateTime.Now,
                Name = "Khác",
                Slug = "others",
                IsDeleted = false
            }
        };

        _context.Folders.AddRange(folders);
        await _context.SaveChangesAsync(cancellationToken);
    }

    #endregion

    #region Delete

    public async Task<bool> ToggleDeleteFilesStatusAsync(Guid fileId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<File>()
            .Where(x => x.Id == fileId)
            .ExecuteUpdateAsync(p => p.SetProperty(x => x.IsDeleted, x => !x.IsDeleted), cancellationToken) > 0;
    }

    public async Task<bool> DeleteFileAsync(Guid fileId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<File>()
            .Where(x => x.Id == fileId)
            .ExecuteDeleteAsync(cancellationToken) > 0;
    }

    #endregion
}