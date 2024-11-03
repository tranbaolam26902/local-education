using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LocalEducation.Data.Mappings;

public class TourMap : IEntityTypeConfiguration<Tour>
{
	public void Configure(EntityTypeBuilder<Tour> builder)
	{
		builder.ToTable("Tours");

		builder.HasKey(t => t.Id);

		#region Properties config

		builder.Property(t => t.Title)
			.IsRequired()
			.HasMaxLength(512);

		builder.Property(t => t.UrlSlug)
			.IsRequired()
			.HasMaxLength(512);

		builder.Property(t => t.CreatedDate)
			.IsRequired()
			.HasColumnType("datetime");

		builder.Property(t => t.ViewCount)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(t => t.IsPublished)
			.IsRequired()
			.HasDefaultValue(false);

		builder.Property(t => t.IsDeleted)
			.HasDefaultValue(false);

		#endregion

		builder.HasMany(t => t.Scenes)
			.WithOne(s => s.Tour)
			.HasForeignKey(s => s.TourId);

		builder.HasOne(t => t.User)
			.WithMany(u => u.Tours)
			.HasForeignKey(t => t.UserId);

		builder.HasOne(t => t.Atlas)
			.WithOne(a => a.Tour)
			.HasForeignKey<Atlas>(t => t.Id);
	}
}