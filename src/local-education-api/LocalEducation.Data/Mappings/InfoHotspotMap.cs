using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LocalEducation.Data.Mappings;

public class InfoHotspotMap : IEntityTypeConfiguration<InfoHotspot>
{
	public void Configure(EntityTypeBuilder<InfoHotspot> builder)
	{
		builder.ToTable("InfoHotspots");

		builder.HasKey(i => i.Id);

		#region Properties Config

		builder.Property(i => i.Title)
			.HasMaxLength(512)
			.HasDefaultValue("");

		builder.Property(i => i.Description)
			.HasMaxLength(4096)
			.HasDefaultValue("");

		builder.Property(i => i.Address)
			.HasMaxLength(512)
			.HasDefaultValue("");

		builder.Property(i => i.ThumbnailPath)
			.HasMaxLength(512)
			.HasDefaultValue("");

		builder.Property(c => c.CreatedDate)
			.IsRequired()
			.HasColumnType("datetime");

		builder.Property(i => i.X)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(i => i.Y)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(i => i.Z)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(s => s.LessonId)
			.HasDefaultValue(null);

		builder.Property(s => s.InfoId)
			.HasDefaultValue(null);

		#endregion
	}
}