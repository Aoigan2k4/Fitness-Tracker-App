import React, { useState } from "react";
import "./WeeklySchedule.css";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WeeklySchedule = () => {
  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { sleepTime: "22:00", wakeUpTime: "06:00", workStart: "09:00", workEnd: "17:00" };
      return acc;
    }, {})
  );

  const [workoutGoal, setWorkoutGoal] = useState("strength");

  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  const calculateFreeTime = (day) => {
    const { sleepTime, wakeUpTime, workStart, workEnd } = schedule[day];

    const sleep = convertTimeToMinutes(sleepTime);
    const wakeUp = convertTimeToMinutes(wakeUpTime);
    const workStartTime = convertTimeToMinutes(workStart);
    const workEndTime = convertTimeToMinutes(workEnd);

    let freeTimeSlots = [];

    if (wakeUp < workStartTime) {
      freeTimeSlots.push({ start: wakeUp, end: workStartTime, type: "morning" });
    }

    if (workEndTime < sleep) {
      freeTimeSlots.push({ start: workEndTime, end: sleep, type: "evening" });
    }

    return freeTimeSlots;
  };

  const recommendWorkoutTime = (freeTimeSlots) => {
    if (freeTimeSlots.length === 0) return "No available workout time.";

    let recommendedSlot;
    if (workoutGoal === "strength") {
      recommendedSlot = freeTimeSlots.find((slot) => slot.type === "morning" && (slot.end - slot.start) >= 60);
    } else if (workoutGoal === "cardio") {
      recommendedSlot = freeTimeSlots.find((slot) => slot.type === "evening" && (slot.end - slot.start) >= 60);
    } else {
      recommendedSlot = freeTimeSlots.find((slot) => (slot.end - slot.start) >= 30);
    }

    if (recommendedSlot) {
      const startTime = convertMinutesToTime(recommendedSlot.start);
      const endTime = convertMinutesToTime(recommendedSlot.start + 60);
      return `Workout Time: ${startTime} - ${endTime}`;
    } else {
      return "Not enough free time for a workout.";
    }
  };

  return (
    <div className="weekly-schedule">
      <h1>Weekly Schedule Management</h1>
      <div className="workout-goal">
        <label>
          Workout Goal:
          <select value={workoutGoal} onChange={(e) => setWorkoutGoal(e.target.value)}>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
          </select>
        </label>
      </div>
      <div className="schedule-table">
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Wake-up</th>
              <th>Work Start</th>
              <th>Work End</th>
              <th>Bedtime</th>
              <th>Workout Time</th>
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day) => {
              const freeTimeSlots = calculateFreeTime(day);
              const recommendation = recommendWorkoutTime(freeTimeSlots);
              return (
                <tr key={day}>
                  <td>{day}</td>
                  <td>
                    <input
                      type="time"
                      value={schedule[day].wakeUpTime}
                      onChange={(e) =>
                        setSchedule({ ...schedule, [day]: { ...schedule[day], wakeUpTime: e.target.value } })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={schedule[day].workStart}
                      onChange={(e) =>
                        setSchedule({ ...schedule, [day]: { ...schedule[day], workStart: e.target.value } })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={schedule[day].workEnd}
                      onChange={(e) =>
                        setSchedule({ ...schedule, [day]: { ...schedule[day], workEnd: e.target.value } })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={schedule[day].sleepTime}
                      onChange={(e) =>
                        setSchedule({ ...schedule, [day]: { ...schedule[day], sleepTime: e.target.value } })
                      }
                    />
                  </td>
                  <td className="workout-recommendation">{recommendation}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleManagement;
