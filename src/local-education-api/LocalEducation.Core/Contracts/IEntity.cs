namespace LocalEducation.Core.Contracts;

public interface IEntity
{
	public Guid Id { get; set; }

    public DateTime CreatedDate { get; set; }
}