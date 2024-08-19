using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using File = LocalEducation.Core.Entities.File;

namespace LocalEducation.Data.Mappings;

public class FileMap : IEntityTypeConfiguration<File>
{
    public void Configure(EntityTypeBuilder<File> builder)
    {
        builder.ToTable("Files");

        builder.HasKey(f => f.Id);

        #region Properties config

        builder.Property(f => f.Name)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(f => f.Path)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(f => f.ThumbnailPath)
            .HasMaxLength(512);

        builder.Property(f => f.IsDeleted)
            .HasDefaultValue(false);

        builder.Property(s => s.Size)
            .HasDefaultValue(0);

        builder.Property(s => s.CreatedDate)
            .IsRequired()
            .HasColumnType("datetime");

        builder.Property(f => f.FileType)
            .IsRequired()
            .HasDefaultValue(FileType.None);

        #endregion
    }
}