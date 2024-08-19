using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LocalEducation.Data.Mappings;

public class LinkHotspotMap : IEntityTypeConfiguration<LinkHotspot>
{
	public void Configure(EntityTypeBuilder<LinkHotspot> builder)
	{
		builder.ToTable("LinkHotspots");

		builder.HasKey(l => l.Id);

		#region Properties config

		builder.Property(l => l.Title)
			.IsRequired()
			.HasMaxLength(256);

		builder.Property(l => l.SceneIndex)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(l => l.X)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(l => l.Y)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(l => l.Z)
			.IsRequired()
			.HasDefaultValue(0);

        builder.Property(c => c.CreatedDate)
            .IsRequired()
            .HasColumnType("datetime");
        #endregion
    }
}