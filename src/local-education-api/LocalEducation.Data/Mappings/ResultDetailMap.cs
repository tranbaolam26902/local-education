using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LocalEducation.Data.Mappings;

public class ResultDetailMap : IEntityTypeConfiguration<ResultDetail>
{
    public void Configure(EntityTypeBuilder<ResultDetail> builder)
    {
        builder.ToTable("ResultDetails");

        builder.HasKey(rd => rd.Id);

        #region Properties config

        builder.Property(rd => rd.CreatedDate)
            .IsRequired()
            .HasColumnType("datetime");

        builder.Property(rd => rd.UserId)
            .IsRequired();

        builder.Property(rd => rd.SlideId)
            .IsRequired();

        builder.Property(rd => rd.Point);

        builder.Property(rd => rd.Answer)
            .HasMaxLength(2048);

        builder.Property(rd => rd.CorrectAnswer)
            .HasMaxLength(2048);

        #endregion

        #region Relationships

        builder.HasOne(rd => rd.User)
            .WithMany(u => u.ResultDetails)
            .HasForeignKey(rd => rd.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(rd => rd.Slide)
            .WithMany(s => s.ResultDetails)
            .HasForeignKey(rd => rd.SlideId)
            .OnDelete(DeleteBehavior.Cascade);

        #endregion
        
    }
}