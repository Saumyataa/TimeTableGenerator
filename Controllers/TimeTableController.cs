using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using TimeTableGenerator.Models;

public class TimeTableController : Controller
{
    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    public IActionResult GenerateTimeTable([FromBody] TimeTableModel model)
    {
        if (model.SubjectHours == null || model.SubjectHours.Values.Sum() != model.TotalHours)
        {
            return Json(new { success = false, message = "Total subject hours must match the total weekly hours." });
        }

        try
        {
            var timetable = GenerateTimetable(model);
            return Json(new { success = true, data = timetable });
        }
        catch (Exception ex)
        {
            return Json(new { success = false, message = "An error occurred while generating the timetable." });
        }
    }

    public List<List<string>> GenerateTimetable(TimeTableModel model)
    {
        List<string> subjectPool = new List<string>();
        foreach (var subject in model.SubjectHours)
            subjectPool.AddRange(Enumerable.Repeat(subject.Key, subject.Value));

        Random rnd = new Random();
        subjectPool = subjectPool.OrderBy(x => rnd.Next()).ToList();

        List<List<string>> timetable = new List<List<string>>();
        int index = 0;
        for (int i = 0; i < model.SubjectsPerDay; i++)
        {
            List<string> row = new List<string>();
            for (int j = 0; j < model.WorkingDays; j++)
            {
                row.Add(subjectPool[index++ % subjectPool.Count]);
            }
            timetable.Add(row);
        }
        return timetable;
    }
}
