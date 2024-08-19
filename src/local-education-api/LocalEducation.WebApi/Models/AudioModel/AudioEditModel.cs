namespace LocalEducation.WebApi.Models.AudioModel;

public class AudioEditModel
{
    public string Path { get; set; }

    public string ThumbnailPath { get; set; }

    public bool AutoPlay { get; set; }

    public bool LoopAudio { get; set; }
}