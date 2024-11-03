using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LocalEducation.Data.Mappings;

public class SlideMap : IEntityTypeConfiguration<Slide>
{
	public void Configure(EntityTypeBuilder<Slide> builder)
	{
		builder.ToTable("Slides");

		builder.HasKey(s => s.Id);

		#region Properties config

		builder.Property(s => s.Title)
			.IsRequired()
			.HasMaxLength(512)
			.HasDefaultValue("");

		builder.Property(s => s.Content)
			.IsRequired()
			.HasDefaultValue("");

		builder.Property(s => s.Index)
			.HasDefaultValue(0);

		builder.Property(s => s.ThumbnailPath)
			.HasMaxLength(512)
			.HasDefaultValue("");

		builder.Property(s => s.UrlPath)
			.HasMaxLength(512)
			.HasDefaultValue("");

		builder.Property(s => s.IsPublished)
			.HasDefaultValue(false);

		builder.Property(s => s.Layout)
			.HasMaxLength(512);

		builder.Property(c => c.CreatedDate)
			.IsRequired()
			.HasColumnType("datetime");
		#endregion
	}
}