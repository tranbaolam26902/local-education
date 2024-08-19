namespace LocalEducation.WebApi.Models.FileModel;

public class FileFilterModel : PagingModel
{
	public string Keyword { get; set; } = "";
	public Guid? FolderId { get; set; } = Guid.Empty;
	public bool? IsDeleted { get; set; } = false;
}