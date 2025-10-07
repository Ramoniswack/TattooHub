'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Clock } from 'lucide-react';

interface TimeSlot {
  start: string;
  end: string;
}

interface Availability {
  [key: string]: TimeSlot[];
}

interface AvailabilityManagerProps {
  availability: Availability;
  onUpdate: (availability: Availability) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityManager({ availability, onUpdate }: AvailabilityManagerProps) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const addTimeSlot = () => {
    if (startTime >= endTime) {
      alert('End time must be after start time');
      return;
    }

    const newAvailability = { ...availability };
    if (!newAvailability[selectedDay]) {
      newAvailability[selectedDay] = [];
    }

    // Check for overlapping slots
    const overlaps = newAvailability[selectedDay].some(slot => 
      (startTime >= slot.start && startTime < slot.end) ||
      (endTime > slot.start && endTime <= slot.end) ||
      (startTime <= slot.start && endTime >= slot.end)
    );

    if (overlaps) {
      alert('This time slot overlaps with an existing slot');
      return;
    }

    newAvailability[selectedDay].push({ start: startTime, end: endTime });
    newAvailability[selectedDay].sort((a, b) => a.start.localeCompare(b.start));
    onUpdate(newAvailability);
  };

  const removeTimeSlot = (day: string, index: number) => {
    const newAvailability = { ...availability };
    newAvailability[day].splice(index, 1);
    if (newAvailability[day].length === 0) {
      delete newAvailability[day];
    }
    onUpdate(newAvailability);
  };

  const copyToAllDays = () => {
    if (!availability[selectedDay] || availability[selectedDay].length === 0) {
      alert('No time slots to copy');
      return;
    }

    const newAvailability: Availability = {};
    DAYS_OF_WEEK.forEach(day => {
      newAvailability[day] = [...availability[selectedDay]];
    });
    onUpdate(newAvailability);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Booking Availability
        </CardTitle>
        <p className="text-sm text-gray-600">Set your available hours for each day</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Time Slot */}
        <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="day">Day</Label>
              <select
                id="day"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {DAYS_OF_WEEK.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="start">Start Time</Label>
              <Input
                id="start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end">End Time</Label>
              <Input
                id="end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={addTimeSlot} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Time Slot
            </Button>
            <Button onClick={copyToAllDays} size="sm" variant="outline">
              Copy to All Days
            </Button>
          </div>
        </div>

        {/* Display Current Availability */}
        <div className="space-y-3">
          <Label>Current Schedule</Label>
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="min-w-[120px] font-medium text-gray-700">{day}</div>
              <div className="flex-1 flex flex-wrap gap-2">
                {availability[day] && availability[day].length > 0 ? (
                  availability[day].map((slot, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2">
                      {slot.start} - {slot.end}
                      <button
                        onClick={() => removeTimeSlot(day, index)}
                        className="hover:text-red-600 ml-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">Not available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
