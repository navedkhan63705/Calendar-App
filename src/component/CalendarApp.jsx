import React from "react";
import { useState } from "react";

// ==================== DATA ====================
const SAMPLE_EVENTS = [
  { id: 1, title: "Team Meeting", date: "2025-05-22", startTime: "10:00", endTime: "11:00", type: "meeting" },
  { id: 2, title: "Project Deadline", date: "2025-05-24", startTime: "23:59", endTime: "23:59", type: "deadline" },
  { id: 3, title: "Client Presentation", date: "2025-05-28", startTime: "14:00", endTime: "16:00", type: "presentation" },
  { id: 4, title: "Code Review", date: "2025-05-23", startTime: "15:30", endTime: "17:00", type: "review" },
];

const EVENT_COLORS = {
  meeting: "bg-blue-500",
  deadline: "bg-red-500",
  break: "bg-green-500",
  presentation: "bg-purple-500",
  review: "bg-yellow-500",
};

// ==================== UTILITY FUNCTIONS ====================
const formatDate = (date) => date.toISOString().split('T')[0];
const isToday = (date) => {
  const today = new Date(2025, 4, 24); // May 24, 2025 (month is 0-indexed)
  return formatDate(date) === formatDate(today);
};
const isSameMonth = (date1, date2) => date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();

const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour12 = parseInt(hours) % 12 || 12;
  const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
};

const calculateDuration = (startTime, endTime) => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  return Math.round((end - start) / (1000 * 60)); // minutes
};

// ==================== CALENDAR HEADER COMPONENT ====================
const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth }) => {
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date(2025, 4, 24).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center">
        <button 
          onClick={onPrevMonth} 
          className="w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">{monthYear}</h1>
          <p className="text-gray-500 text-sm">Today: {today}</p>
        </div>
        
        <button 
          onClick={onNextMonth} 
          className="w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ==================== DAYS OF WEEK HEADER ====================
const DaysOfWeekHeader = () => {
  const days = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"];
  
  return (
    <div className="grid grid-cols-7 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl border-b border-gray-200">
      {days.map((day, index) => (
        <div key={day} className={`py-4 px-2 text-center font-semibold text-lg ${index === 0 || index === 6 ? 'text-red-600' : 'text-gray-700'}`}>
          <div className="hidden md:block">{day}day</div>
          <div className="md:hidden">{day}</div>
        </div>
      ))}
    </div>
  );
};

// ==================== SINGLE EVENT COMPONENT ====================
const EventItem = ({ event }) => {
  const duration = calculateDuration(event.startTime, event.endTime);
  
  return (
    <div 
      className={`text-xs px-2 py-1 rounded-md text-white font-medium truncate mb-1 ${EVENT_COLORS[event.type]} hover:opacity-80 transition-opacity`}
      title={`${event.title}\n${formatTime(event.startTime)} - ${formatTime(event.endTime)}\nDuration: ${duration} minutes`}
    >
      <div className="truncate">{event.title}</div>
      <div className="text-xs opacity-90">{formatTime(event.startTime)}</div>
    </div>
  );
};

// ==================== CALENDAR DAY CELL ====================
const CalendarDay = ({ date, isCurrentMonth, events, onDateClick }) => {
  const dayNumber = date.getDate();
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const todayClass = isToday(date) ? "bg-gradient-to-br from-blue-100 to-blue-200 ring-2 ring-blue-400" : "";
  const monthClass = isCurrentMonth ? "text-gray-800 hover:bg-blue-50" : "text-gray-400 bg-gray-50";
  const weekendClass = isWeekend && isCurrentMonth ? "text-red-600" : "";
  
  return (
    <div 
      onClick={() => onDateClick(date, events)}
      className={`h-28 p-2 border border-gray-200 cursor-pointer transition-all duration-200 ${todayClass} ${monthClass} ${weekendClass} hover:shadow-md relative`}
    >
      <div className="font-semibold mb-2 text-lg">{dayNumber}</div>
      
      {/* Today indicator */}
      {isToday(date) && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      )}
      
      <div className="space-y-1 overflow-hidden">
        {events.slice(0, 2).map(event => (
          <EventItem key={event.id} event={event} />
        ))}
        {events.length > 2 && (
          <div className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-md">
            +{events.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== CALENDAR GRID ====================
const CalendarGrid = ({ currentDate, events, onDateClick }) => {
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const totalDays = 42; // 6 weeks × 7 days
    
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    const dateString = formatDate(date);
    return events.filter(event => event.date === dateString);
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-7 divide-x divide-gray-200">
        {calendarDays.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          
          return (
            <CalendarDay 
              key={index}
              date={date}
              isCurrentMonth={isCurrentMonth}
              events={dayEvents}
              onDateClick={onDateClick}
            />
          );
        })}
      </div>
    </div>
  );
};

// ==================== EVENT FORM COMPONENT ====================
const EventForm = ({ selectedDate, eventToEdit = null, onSave, onCancel }) => {
  const [eventData, setEventData] = useState({
    title: eventToEdit?.title || "",
    startTime: eventToEdit?.startTime || "",
    endTime: eventToEdit?.endTime || "",
    type: eventToEdit?.type || "meeting"
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!eventData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!eventData.startTime) {
      newErrors.startTime = "Start time is required";
    }
    
    if (!eventData.endTime) {
      newErrors.endTime = "End time is required";
    }
    
    if (eventData.startTime && eventData.endTime) {
      const start = new Date(`2000-01-01T${eventData.startTime}`);
      const end = new Date(`2000-01-01T${eventData.endTime}`);
      
      if (end <= start) {
        newErrors.endTime = "End time must be after start time";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const eventToSave = {
      
      title: eventData.title.trim(),
      date: formatDate(selectedDate),
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      type: eventData.type
    };
    
    onSave(eventToSave);
  };

  const handleInputChange = (field, value) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const duration = eventData.startTime && eventData.endTime 
    ? calculateDuration(eventData.startTime, eventData.endTime) 
    : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
        <input
          type="text"
          placeholder="Enter event title"
          value={eventData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
          <input
            type="time"
            value={eventData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.startTime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
          <input
            type="time"
            value={eventData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.endTime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
        </div>
      </div>
      
      {duration > 0 && (
        <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
          <strong>Duration:</strong> {duration} minutes ({Math.floor(duration / 60)}h {duration % 60}m)
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
        <select
          value={eventData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="meeting">Meeting</option>
          <option value="deadline">Deadline</option>
          <option value="break">Break</option>
          <option value="presentation">Presentation</option>
          <option value="review">Review</option>
        </select>
      </div>
      
      <div className="flex gap-3 pt-2">
        <button 
          type="submit"
          className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          {eventToEdit ? 'Update Event' : 'Add Event'}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// ==================== EVENT LIST ITEM COMPONENT ====================
const EventListItem = ({ event }) => {
  const duration = calculateDuration(event.startTime, event.endTime);
  
  return (
    <div className={`p-4 rounded-lg text-white ${EVENT_COLORS[event.type]} mb-3`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-lg mb-1">{event.title}</h4>
          <div className="text-sm opacity-90">
            <p>⏰ {formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
            <p>📅 Duration: {duration} minutes ({Math.floor(duration / 60)}h {duration % 60}m)</p>
            <p className="capitalize">📋 Type: {event.type}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== EVENT MODAL ====================
const EventModal = ({ selectedDate, events, onClose, onAddEvent }) => {
  const [showForm, setShowForm] = useState(false);

  if (!selectedDate) return null;

  const dateString = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const handleSaveEvent = (eventData) => {
    onAddEvent(eventData);
    setShowForm(false);
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 bg-[#0000009c] bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-96 overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Events for {dateString}</h3>
            <p className="text-sm text-gray-500 mt-1">{events.length} event{events.length !== 1 ? 's' : ''} scheduled</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-80">
          {/* Existing Events */}
          {events.length > 0 ? (
            <div className="mb-4">
              {events.map(event => (
                <EventListItem 
                  key={event.id} 
                  event={event} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-2">No events scheduled</p>
              <p className="text-sm text-gray-400">Click "Add Event" to create one</p>
            </div>
          )}
          
          {/* Add/Edit Event Form or Button */}
          {!showForm ? (
            <button 
              onClick={() => setShowForm(true)}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              + Add New Event
            </button>
          ) : (
            <EventForm 
              selectedDate={selectedDate}
              onSave={handleSaveEvent}
              onCancel={handleCancelForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== EVENT LEGEND ====================
const EventLegend = () => {
  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Types & Features</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        {Object.entries(EVENT_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-lg ${color} shadow-sm`}></div>
            <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Today's Date</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-medium">Red Text</span>
              <span>Weekends</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Events</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete Events</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN CALENDAR APP ====================
const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 24)); // May 24, 2025
  const [events, setEvents] = useState(SAMPLE_EVENTS);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Date click handler
  const handleDateClick = (date, dayEvents) => {
    setSelectedDate(date);
    setSelectedDateEvents(dayEvents);
    setShowModal(true);
  };

  // Add new event
  const handleAddEvent = (newEvent) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
    setSelectedDateEvents(prevEvents => [...prevEvents, newEvent]);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setSelectedDateEvents([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Calendar Header */}
        <CalendarHeader 
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        
        {/* Days of Week Header */}
        <DaysOfWeekHeader />
        
        {/* Calendar Grid */}
        <CalendarGrid 
          currentDate={currentDate}
          events={events}
          onDateClick={handleDateClick}
        />
        
        {/* Event Legend */}
        <EventLegend />
        
        {/* Event Modal */}
        {showModal && (
          <EventModal 
            selectedDate={selectedDate}
            events={selectedDateEvents}
            onClose={handleCloseModal}
            onAddEvent={handleAddEvent}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarApp;