using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Entities;

public enum FileType
{
	None = 0,
	Video,
	Image,
	Panorama,
	Audio,
	Other
}

public class File : IEntity
{
	public Guid Id { get; set; }

	public string Name { get; set; }

	public string Path { get; set; }

	public string ThumbnailPath { get; set; }

	public DateTime CreatedDate { get; set; }

	public Guid FolderId { get; set; }

	public FileType FileType { get; set; }

	public bool IsDeleted { get; set; }

	public float Size { get; set; }

	// ======================================================
	// Navigation properties
	// ======================================================

	public Folder Folder { get; set; }
}