using LocalEducation.Core.Entities;

namespace LocalEducation.Core.Constants;

public class SlideProgress
{
    public Guid Id { get; set; }

    public Guid LessonId { get; set; }

    public int SlideIndex { get; set; }

    public bool IsCompleted { get; set; }

    public Guid ResultId { get; set; }

    public int PointCorrect { get; set; }

    public SlideProgress()
    {
        
    }

    public SlideProgress(Slide s, Guid resultId, bool isCompleted = true)
    {
        Id = s.Id;
        SlideIndex = s.Index;
        LessonId = s.LessonId;
        IsCompleted = isCompleted;
        ResultId = resultId;
    }
}

public enum ProgressStatus
{
    InProgress,
    Completed,
    NotStarted,
}