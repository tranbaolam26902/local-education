namespace LocalEducation.Core.Queries;

public class FileQuery : IFileQuery
{
    public string Keyword { get; set; }
    public Guid FolderId { get; set; }
    public bool IsDeleted { get; set; }
}