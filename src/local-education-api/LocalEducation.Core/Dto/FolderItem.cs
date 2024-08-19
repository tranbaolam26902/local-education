using LocalEducation.Core.Entities;

namespace LocalEducation.Core.Dto;

public class FolderItem
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string Slug { get; set; }

    public DateTime CreatedDate { get; set; }

    public Guid UserId { get; set; }

    public bool IsDeleted { get; set; }

    public float TotalSize { get; set; }

    public FolderItem(Folder model)
    {
        Id = model.Id;
        Name = model.Name;
        CreatedDate = model.CreatedDate;
        UserId = model.UserId;
        IsDeleted = model.IsDeleted;
        Slug = model.Slug;
        TotalSize = model.Files.Sum(s => s.Size);
    }
}