using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LocalEducation.Data.Mappings;

public class AtlasMap : IEntityTypeConfiguration<Atlas>
{
	public void Configure(EntityTypeBuilder<Atlas> builder)
	{
		builder.ToTable("Atlases");

		builder.HasKey(a => a.Id);

		#region Properties config

		builder.Property(a => a.Path)
			.IsRequired()
			.HasMaxLength(1024);

		builder.Property(a => a.IsShowOnStartUp)
			.IsRequired()
			.HasDefaultValue(false);

		#endregion

		builder.HasMany(a => a.Pins)
			.WithOne(p => p.Atlas)
			.HasForeignKey(p => p.AtlasId)
			.OnDelete(DeleteBehavior.Cascade);
	}
}

public class PinMap : IEntityTypeConfiguration<Pin>
{
	public void Configure(EntityTypeBuilder<Pin> builder)
	{
		builder.ToTable("Pins");

		builder.HasKey(p => p.Id);

		#region Properties config

		builder.Property(p => p.Top)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(p => p.Left)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(p => p.SceneIndex)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(p => p.Title)
			.HasMaxLength(512)
			.HasDefaultValue("");

		builder.Property(p => p.ThumbnailPath)
			.HasMaxLength(1024);

		#endregion

		builder.HasOne(p => p.Atlas)
			.WithMany(a => a.Pins)
			.HasForeignKey(p => p.AtlasId)
			.OnDelete(DeleteBehavior.Cascade);
	}
}