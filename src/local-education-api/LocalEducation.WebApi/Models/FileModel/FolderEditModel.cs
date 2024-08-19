namespace LocalEducation.WebApi.Models.FileModel;

public class FolderEditModel
{
	public string Name { get; set; }

	public Guid ParentFolderId { get; set; }

	public string ParentPath { get; set; }
}