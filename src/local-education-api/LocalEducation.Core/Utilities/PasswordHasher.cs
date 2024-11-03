using System.Security.Cryptography;

namespace LocalEducation.Core.Utilities;

public class PasswordHasher : IPasswordHasher
{
	private const int SaltSize = 128 / 8;
	private const int KeySize = 256 / 8;
	private const int Iterations = 10000;
	private static readonly HashAlgorithmName HashAlgorithmName = HashAlgorithmName.SHA256;
	private static readonly char Delimiter = ';';

	public string Hash(string password)
	{
		byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
		byte[] hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName, KeySize);

		return string.Join(Delimiter, Convert.ToBase64String(salt), Convert.ToBase64String(hash));
	}

	public bool VerifyPassword(string password, string inputPassword)
	{
		string[] element = password.Split(Delimiter);
		byte[] salt = Convert.FromBase64String(element[0]);
		byte[] hash = Convert.FromBase64String(element[1]);
		byte[] hashInput = Rfc2898DeriveBytes.Pbkdf2(inputPassword, salt, Iterations, HashAlgorithmName, KeySize);

		return CryptographicOperations.FixedTimeEquals(hash, hashInput);
	}
}