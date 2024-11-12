using LocalEducation.Core.Contracts;

namespace LocalEducation.Core.Entities;

public class Folder : IEntity
{
	public Guid Id { get; set; }

	public string Name { get; set; }

	public string Slug { get; set; }

	public DateTime CreatedDate { get; set; }

	public Guid UserId { get; set; }

	public bool IsDeleted { get; set; }

	// ======================================================
	// Navigation properties
	// ======================================================

	public IList<File> Files { get; set; }

	public User User { get; set; }
}