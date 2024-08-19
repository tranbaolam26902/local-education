namespace LocalEducation.Core.Queries;

public interface IFileQuery
{
    public string Keyword { get; set; }
    public Guid FolderId { get; set; }
    public bool IsDeleted { get; set; }
}