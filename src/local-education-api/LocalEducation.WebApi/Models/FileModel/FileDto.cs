namespace LocalEducation.WebApi.Models.FileModel;

public class FileDto
{
	public Guid Id { get; set; }

	public string Name { get; set; }

	public string Path { get; set; }

	public string ThumbnailPath { get; set; }

	public DateTime CreatedDate { get; set; }

	public Guid FolderId { get; set; }

	public string FileType { get; set; }

	public bool IsDeleted { get; set; }

	public float Size { get; set; }
}