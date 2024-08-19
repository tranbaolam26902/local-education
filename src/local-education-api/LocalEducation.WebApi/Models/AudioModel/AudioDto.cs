namespace LocalEducation.WebApi.Models.AudioModel;

public class AudioDto
{
    public Guid Id { get; set; }

    public string Path { get; set; }

    public string ThumbnailPath { get; set; }

    public bool AutoPlay { get; set; }

    public bool LoopAudio { get; set; }

}