import React, { useState } from 'react';
import './ScheduleManagement.css';

const ScheduleManagement = () => {
  const [sleepTime, setSleepTime] = useState('22:00');
  const [wakeUpTime, setWakeUpTime] = useState('06:00');
  const [workStartTime, setWorkStartTime] = useState('09:00');
  const [workEndTime, setWorkEndTime] = useState('17:00');
  const [workoutGoal, setWorkoutGoal] = useState('strength');

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

  const convertTimeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const convertMinutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const recommendWorkoutTime = (freeTimeSlots: { start: number; end: number; type: string }[]) => {
    if (freeTimeSlots.length === 0) return 'There is no free time available for training.';

    let recommendedSlot;
    if (workoutGoal === 'strength') {
      recommendedSlot = freeTimeSlots.find((slot) => slot.type === 'morning' && (slot.end - slot.start) >= 60);
    } else if (workoutGoal === 'cardio') {
      recommendedSlot = freeTimeSlots.find((slot) => slot.type === 'evening' && (slot.end - slot.start) >= 60);
    } else {
      recommendedSlot = freeTimeSlots.find((slot) => (slot.end - slot.start) >= 30);
    }

    if (recommendedSlot) {
      const startTime = convertMinutesToTime(recommendedSlot.start);
      const endTime = convertMinutesToTime(recommendedSlot.start + 60);
      return `Recommended training schedule: ${startTime} - ${endTime}`;
    } else {
      return 'There is not enough free time to train.';
    }
  };

  const freeTimeSlots = calculateFreeTime();
  const recommendation = recommendWorkoutTime(freeTimeSlots);

  return (
    <div className="schedule-management">
      <h1>Schedule/Sleep Management</h1>
      <div className="input-section">
        <label>
          Bedtime:
          <input type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} />
        </label>
        <label>
          Wake-up Time:
          <input type="time" value={wakeUpTime} onChange={(e) => setWakeUpTime(e.target.value)} />
        </label>
        <label>
          Work Start Time:
          <input type="time" value={workStartTime} onChange={(e) => setWorkStartTime(e.target.value)} />
        </label>
        <label>
          Work End Time:
          <input type="time" value={workEndTime} onChange={(e) => setWorkEndTime(e.target.value)} />
        </label>
        <label>
          Workout Goal:
          <select value={workoutGoal} onChange={(e) => setWorkoutGoal(e.target.value)}>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
          </select>
        </label>
      </div>
      <div className="schedule-grid">
        <h2>Free Time Slots</h2>
        {freeTimeSlots.length > 0 ? (
          freeTimeSlots.map((slot, index) => (
            <div key={index} className="time-slot">
              {`${convertMinutesToTime(slot.start)} - ${convertMinutesToTime(slot.end)}`}
            </div>
          ))
        ) : (
          <p>No free time slots available.</p>
        )}
      </div>
      <div className="recommendation">
        <h2>Recommendation</h2>
        <p>{recommendation}</p>
      </div>
    </div>
  );
};

export default ScheduleManagement;