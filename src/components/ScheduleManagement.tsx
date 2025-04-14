import React, { useState } from 'react';
import '../Styles/ScheduleManagement.css';

const ScheduleManagement = () => {
  const [sleepTime, setSleepTime] = useState('22:00');
  const [wakeUpTime, setWakeUpTime] = useState('06:00');
  const [workStartTime, setWorkStartTime] = useState('09:00');
  const [workEndTime, setWorkEndTime] = useState('17:00');
  const [workoutGoal, setWorkoutGoal] = useState('strength');

  const convertTimeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const convertMinutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const calculateFreeTime = () => {
    const sleep = convertTimeToMinutes(sleepTime);
    const wakeUp = convertTimeToMinutes(wakeUpTime);
    const workStart = convertTimeToMinutes(workStartTime);
    const workEnd = convertTimeToMinutes(workEndTime);
    const freeTimeSlots: { start: number; end: number; type: string }[] = [];

    if (wakeUp < workStart) {
      freeTimeSlots.push({ start: wakeUp, end: workStart, type: 'morning' });
    }

    if (workEnd < sleep) {
      freeTimeSlots.push({ start: workEnd, end: sleep, type: 'evening' });
    }

    return freeTimeSlots;
  };

  const recommendWorkoutTime = (slots: { start: number; end: number; type: string }[]) => {
    if (slots.length === 0) return 'There is no free time available for training.';
    let recommendedSlot;

    if (workoutGoal === 'strength') {
      recommendedSlot = slots.find((s) => s.type === 'morning' && (s.end - s.start) >= 60);
    } else if (workoutGoal === 'cardio') {
      recommendedSlot = slots.find((s) => s.type === 'evening' && (s.end - s.start) >= 60);
    } else {
      recommendedSlot = slots.find((s) => (s.end - s.start) >= 30);
    }

    if (recommendedSlot) {
      const start = convertMinutesToTime(recommendedSlot.start);
      const end = convertMinutesToTime(recommendedSlot.start + 60);
      return `Recommended training schedule: ${start} - ${end}`;
    } else {
      return 'There is not enough free time to train.';
    }
  };

  const freeTimeSlots = calculateFreeTime();
  const recommendation = recommendWorkoutTime(freeTimeSlots);

  return (
    <div className="schedule-page">
      <div className="schedule-management-card">
        <div className="left-section">
          <div className="schedule-icon" />
          <h1>Schedule/Sleep Management</h1>
          <div className="input-section">
            <label>Bedtime:
              <input type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} />
            </label>
            <label>Wake-up Time:
              <input type="time" value={wakeUpTime} onChange={(e) => setWakeUpTime(e.target.value)} />
            </label>
            <label>Work Start Time:
              <input type="time" value={workStartTime} onChange={(e) => setWorkStartTime(e.target.value)} />
            </label>
            <label>Work End Time:
              <input type="time" value={workEndTime} onChange={(e) => setWorkEndTime(e.target.value)} />
            </label>
            <label>Workout Goal:
              <select value={workoutGoal} onChange={(e) => setWorkoutGoal(e.target.value)}>
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </label>
          </div>
        </div>

        <div className="right-section">
          <h2>Free Time Slots</h2>
          {freeTimeSlots.map((slot, index) => (
            <div className="time-slot" key={index}>
              {`${convertMinutesToTime(slot.start)} - ${convertMinutesToTime(slot.end)}`}
            </div>
          ))}

          <div className="recommendation">
            <h3>Recommendation</h3>
            <p>{recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;
