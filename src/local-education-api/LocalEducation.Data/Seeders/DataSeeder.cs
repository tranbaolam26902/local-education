using LocalEducation.Core.Entities;
using LocalEducation.Core.Utilities;
using LocalEducation.Data.Contexts;

namespace LocalEducation.Data.Seeders;

public class DataSeeder : IDataSeeder
{
	private readonly LocalEducationDbContext _dbContext;
	private readonly IPasswordHasher _hasher;

	public DataSeeder(LocalEducationDbContext dbContext, IPasswordHasher hasher)
	{
		_dbContext = dbContext;
		_hasher = hasher;
	}

	public void Initialize()
	{
		_dbContext.Database.EnsureCreated();

		if (_dbContext.Users.Any())
		{
			return;
		}
		IList<Role> roles = AddRoles();
		IList<User> users = AddUsers(roles);
		ActivateCloudStorageAsync(users);

	}

	private IList<Role> AddRoles()
	{
		List<Role> roles =
		[
			new() {Id = Guid.NewGuid(), Name = "Admin"},
			new() {Id = Guid.NewGuid(), Name = "Manager"},
			new() {Id = Guid.NewGuid(), Name = "User"}
		];

		_dbContext.Roles.AddRange(roles);
		_dbContext.SaveChanges();
		return roles;
	}

	private IList<User> AddUsers(IList<Role> roles)
	{
		List<User> users =
		[
			new ()
			{
				Name = "Admin",
				Email = "Admin@gmail.com",
				Address = "DLU",
				Phone = "0123456789",
				Username = "admin",
				CreatedDate = DateTime.Now,
				Password = _hasher.Hash("admin123"),
				Roles =
				[
					roles[0],
					roles[1],
					roles[2]
				]
			},
			new ()
			{
				Name = "User",
				Email = "User@gmail.com",
				Address = "DLU",
				Phone = "0123456789",
				Username = "user",
				CreatedDate = DateTime.Now,
				Password = _hasher.Hash("user123"),
				Roles =
				[
					roles[2]
				]

			}
		];

		_dbContext.Users.AddRange(users);
		_dbContext.SaveChanges();

		return users;
	}

	public IList<Folder> ActivateCloudStorageAsync(IList<User> users)
	{
		Guid userId = users[0].Id;
		List<Folder> folders =
		[
			new()
			{
				UserId = userId,
				CreatedDate = DateTime.Now,
				Name = "Hình ảnh",
				Slug = "images",
				IsDeleted = false
			},
			new()
			{
				UserId = userId,
				CreatedDate = DateTime.Now,
				Name = "Âm thanh",
				Slug = "audios",
				IsDeleted = false
			},
			new()
			{
				UserId = userId,
				CreatedDate = DateTime.Now,
				Name = "Video",
				Slug = "videos",
				IsDeleted = false
			},
			new()
			{
				UserId = userId,
				CreatedDate = DateTime.Now,
				Name = "Khác",
				Slug = "others",
				IsDeleted = false
			}
		];

		_dbContext.Folders.AddRange(folders);
		_dbContext.SaveChanges();

		return folders;
	}
}