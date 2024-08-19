namespace LocalEducation.WebApi.Models.FileModel;

public class FolderDto
{
	public Guid Id { get; set; }

	public string Name { get; set; }

    public string Slug { get; set; }

	public DateTime CreatedDate { get; set; }
	
	public bool IsDeleted { get; set; }

	public float TotalSize { get; set; }
}