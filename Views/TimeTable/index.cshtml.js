$(document).ready(function () {
    // Initialize jQuery Validation
    $("#generateForm").validate({
        rules: {
            workingDays: {
                required: true,
                number: true,
                min: 1,
                max: 7
            },
            subjectsPerDay: {
                required: true,
                number: true,
                min: 1,
                max: 8
            },
            totalSubjects: {
                required: true,
                number: true,
                min: 1
            },
            "subjectNames[]": {
                required: true
            },
            "subjectHours[]": {
                required: true,
                number: true,
                min: 1
            }
        },
        messages: {
            workingDays: {
                required: "Please enter the number of working days.",
                min: "Minimum value is 1.",
                max: "Maximum value is 7."
            },
            subjectsPerDay: {
                required: "Please enter subjects per day.",
                min: "Minimum value is 1.",
                max: "Maximum value is 8."
            },
            totalSubjects: {
                required: "Please enter total subjects.",
                min: "Minimum value is 1."
            },
            "subjectNames[]": {
                required: "Subject name is required."
            },
            "subjectHours[]": {
                required: "Subject hours are required.",
                min: "Minimum 1 hour per subject."
            }
        }
    });

    $("#totalSubjects").on("input", function () {
        let totalSubjects = parseInt($(this).val()) || 0;
        let subjectContainer = $("#subjectHoursContainer");
        subjectContainer.html("");

        for (let i = 0; i < totalSubjects; i++) {
            subjectContainer.append(`
                    <div class="mb-2 row">
                        <div class="col-md-6">
                            <input name="subjectNames[]" type="text" class="form-control" placeholder="Subject Name" required />
                        </div>
                        <div class="col-md-6">
                            <input name="subjectHours[]" type="number" class="form-control subject-hours" min="1" required />
                        </div>
                    </div>
                `);
        }
    });

    $("form").on("input", function () {
        let workingDays = parseInt($("#workingDays").val()) || 0;
        let subjectsPerDay = parseInt($("#subjectsPerDay").val()) || 0;
        let totalHours = workingDays * subjectsPerDay;
        $("#totalHours").val(totalHours);

        let allocatedHours = 0;
        $(".subject-hours").each(function () {
            allocatedHours += parseInt($(this).val()) || 0;
        });

        $("#generateBtn").prop("disabled", allocatedHours !== totalHours);
    });

    $("#generateBtn").click(function () {
        if (!$("#generateForm").valid()) return;

        let formData = {
            workingDays: $("#workingDays").val(),
            subjectsPerDay: $("#subjectsPerDay").val(),
            totalSubjects: $("#totalSubjects").val(),
            subjectHours: {}
        };

        $("input[name='subjectNames[]']").each(function (index) {
            let subjectName = $(this).val();
            let subjectHour = $("input[name='subjectHours[]']").eq(index).val();
            formData.subjectHours[subjectName] = parseInt(subjectHour);
        });

        $.ajax({
            url: "/TimeTable/GenerateTimeTable",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (response.success) {
                    displayTimetable(response.data);
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert("Error generating timetable!");
            }
        });
    });

    function displayTimetable(timetable) {
        let tableHtml = `<h2 class="text-center mt-4">Final Generated Timetable</h2>`;
        tableHtml += `<table class="table table-bordered">`;

        timetable.forEach(row => {
            tableHtml += "<tr>";
            row.forEach(subject => {
                tableHtml += `<td>${subject}</td>`;
            });
            tableHtml += "</tr>";
        });

        tableHtml += "</table>";
        $("#timetableResult").html(tableHtml);
    }
});