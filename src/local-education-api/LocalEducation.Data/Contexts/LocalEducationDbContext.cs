using LocalEducation.Core.Entities;
using LocalEducation.Data.Mappings;
using Microsoft.EntityFrameworkCore;
using File = LocalEducation.Core.Entities.File;

namespace LocalEducation.Data.Contexts;

public class LocalEducationDbContext : DbContext
{
	public DbSet<User> Users { get; set; }

	public DbSet<Role> Roles { get; set; }

	public DbSet<UserLogin> UserLogin { get; set; }

	public DbSet<File> Files { get; set; }

	public DbSet<Folder> Folders { get; set; }

	public DbSet<Tour> Tours { get; set; }

	public DbSet<Scene> Scenes { get; set; }

	public DbSet<Atlas> Atlases { get; set; }

	public DbSet<Pin> Pins { get; set; }

    public DbSet<Audio> Audios { get; set; }

	public DbSet<LinkHotspot> LinkHotspots { get; set; }

	public DbSet<InfoHotspot> InfoHotspots { get; set; }

    public DbSet<Progress> Progresses { get; set; }

    public DbSet<Course> Courses { get; set; }

    public DbSet<Lesson> Lessons { get; set; }

    public DbSet<Slide> Slides { get; set; }

    public DbSet<Question> Questions { get; set; }

	public DbSet<Option> Options { get; set; }

    public DbSet<ResultDetail> ResultDetails { get; set; }	

	public LocalEducationDbContext(DbContextOptions<LocalEducationDbContext> options) : base(options)
	{

	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.ApplyConfigurationsFromAssembly(typeof(RoleMap).Assembly);
	}
}
