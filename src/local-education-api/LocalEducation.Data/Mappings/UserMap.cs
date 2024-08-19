using LocalEducation.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LocalEducation.Data.Mappings;

public class UserMap : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(p => p.Id);

        builder.Property(s => s.CreatedDate)
            .IsRequired()
            .HasColumnType("datetime");

        builder.Property(p => p.Name)
            .HasMaxLength(128);

        builder.Property(p => p.Email)
            .IsRequired();

        builder.Property(s => s.Username)
            .IsRequired()
            .HasMaxLength(64);

        builder.Property(s => s.Password)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(s => s.Phone)
            .IsRequired()
            .HasMaxLength(16)
            .HasDefaultValue("");

        builder.Property(s => s.Address)
            .IsRequired()
            .HasMaxLength(512)
            .HasDefaultValue("");

    }
}

public class RoleMap : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name)
            .HasMaxLength(128);

        builder.HasMany(r => r.Users)
            .WithMany(u => u.Roles)
            .UsingEntity(pt => pt.ToTable("UserInRoles"));
    }
}

public class UserLoginMap : IEntityTypeConfiguration<UserLogin>
{
    public void Configure(EntityTypeBuilder<UserLogin> builder)
    {
        builder.ToTable("UserLogins");

        builder.HasKey(p => p.Id);

        builder.Property(u => u.UserAgent)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(u => u.IpAddress)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(s => s.RefreshToken)
            .IsRequired()
            .HasMaxLength(1024);

        builder.Property(c => c.CreatedDate)
            .IsRequired()
            .HasColumnType("datetime");

        builder.HasOne(u => u.User)
            .WithMany(l => l.UserLogins)
            .HasForeignKey(u => u.UserId)
            .HasConstraintName("FK_Users_Logins")
            .OnDelete(DeleteBehavior.Cascade);
    }
}