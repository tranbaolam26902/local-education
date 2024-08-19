using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LocalEducation.Data.Mappings;

public class FolderMap : IEntityTypeConfiguration<Folder>
{
	public void Configure(EntityTypeBuilder<Folder> builder)
	{
		builder.ToTable("Folders");

		builder.HasKey(f => f.Id);

		#region Properties config

		builder.Property(f => f.Name)
			.IsRequired()
			.HasMaxLength(128);

		builder.Property(f => f.IsDeleted)
			.HasDefaultValue(false);

		builder.Property(f => f.CreatedDate)
			.IsRequired()
			.HasColumnType("datetime");

		#endregion

		builder.HasMany(folder => folder.Files)
			.WithOne(file => file.Folder)
			.HasForeignKey(file => file.FolderId)
			.OnDelete(DeleteBehavior.Cascade);
	}
}