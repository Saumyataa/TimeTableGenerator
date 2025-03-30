using System.ComponentModel.DataAnnotations;

public class TimeTableModel
{
    [Required, Range(1, 7)]
    public int WorkingDays { get; set; }

    [Required, Range(1, 8)]
    public int SubjectsPerDay { get; set; }

    [Required, Range(1, 100)]
    public int TotalSubjects { get; set; }

    public int TotalHours => WorkingDays * SubjectsPerDay;

    public Dictionary<string, int>? SubjectHours { get; set; }
}
