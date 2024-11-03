using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LocalEducation.Data.Mappings;

public class SceneMap : IEntityTypeConfiguration<Scene>
{
	public void Configure(EntityTypeBuilder<Scene> builder)
	{
		builder.ToTable("Scenes");

		builder.HasKey(s => s.Id);

		#region Properties config

		builder.Property(s => s.Title)
			.IsRequired()
			.HasMaxLength(512);

		builder.Property(s => s.Index)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(s => s.X)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(s => s.Y)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(s => s.Z)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(s => s.UrlPreview)
			.IsRequired()
			.HasMaxLength(1024)
			.HasDefaultValue("");

		builder.Property(s => s.UrlImage)
			.IsRequired()
			.HasMaxLength(1024)
			.HasDefaultValue("");

		#endregion

		builder.HasMany(s => s.InfoHotspots)
			.WithOne(i => i.Scene)
			.HasForeignKey(i => i.SceneId)
			.OnDelete(DeleteBehavior.Cascade);

		builder.HasMany(s => s.LinkHotspots)
			.WithOne(l => l.Scene)
			.HasForeignKey(l => l.SceneId)
			.OnDelete(DeleteBehavior.Cascade);

		builder.HasOne(t => t.Audio)
			.WithOne(a => a.Scene)
			.HasForeignKey<Audio>(t => t.Id);
	}
}

public class AudioMap : IEntityTypeConfiguration<Audio>
{
	public void Configure(EntityTypeBuilder<Audio> builder)
	{
		builder.ToTable("Audios");

		builder.HasKey(a => a.Id);

		#region Properties config

		builder.Property(a => a.Path)
			.IsRequired()
			.HasMaxLength(1024)
			.HasDefaultValue("");

		builder.Property(a => a.ThumbnailPath)
			.IsRequired()
			.HasMaxLength(1024)
			.HasDefaultValue("");

		builder.Property(a => a.AutoPlay)
			.IsRequired()
			.HasDefaultValue(false);

		builder.Property(a => a.LoopAudio)
			.IsRequired()
			.HasDefaultValue(false);
		#endregion
	}
}