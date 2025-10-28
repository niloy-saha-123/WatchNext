/**
 * @file DatePicker.jsx
 * @description Modern custom date picker component with manual input support
 */
import React, { useState, useRef, useEffect } from 'react';

function DatePicker({ label, value, onChange, error, required, id, name }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [month, setMonth] = useState(new Date(value ? new Date(value) : new Date()).getMonth());
  const [year, setYear] = useState(new Date(value ? new Date(value) : new Date()).getFullYear());
  const [inputValue, setInputValue] = useState(value || '');
  const datePickerRef = useRef(null);
  const inputRef = useRef(null);

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Calculate position dynamically for better viewport handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowMonthPicker(false);
        setShowYearPicker(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const selectedDate = value ? new Date(value) : null;

  const getDaysInMonth = () => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    return new Date(year, month, 1).getDay();
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Update parent immediately to allow manual typing
    onChange({ target: { name, value: newValue } });
  };

  const handleInputFocus = () => {
    // Sync calendar to the input value if valid
    if (inputValue) {
      const date = new Date(inputValue);
      if (!isNaN(date.getTime())) {
        setMonth(date.getMonth());
        setYear(date.getFullYear());
      }
    }
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(year, month, day);
    const formattedDate = newDate.toISOString().split('T')[0];
    setInputValue(formattedDate);
    onChange({ target: { name, value: formattedDate } });
    setIsOpen(false);
    setShowMonthPicker(false);
    setShowYearPicker(false);
  };

  const handleCalendarToggle = () => {
    if (!isOpen && inputValue) {
      // Sync calendar to the input value
      const date = new Date(inputValue);
      if (!isNaN(date.getTime())) {
        setMonth(date.getMonth());
        setYear(date.getFullYear());
      }
    }
    setIsOpen(!isOpen);
  };

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleMonthSelect = (selectedMonth) => {
    setMonth(selectedMonth);
    setShowMonthPicker(false);
  };

  const handleYearSelect = (selectedYear) => {
    setYear(selectedYear);
    setShowYearPicker(false);
  };

  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear + 10; i >= currentYear - 100; i--) {
      years.push(i);
    }
    return years;
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth();
    const firstDayOfMonth = getFirstDayOfMonth();

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === month && 
        selectedDate.getFullYear() === year;
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          className={`
            w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
            ${isSelected 
              ? 'bg-red-500 text-white font-semibold shadow-lg' 
              : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }
          `}
        >
          {day}
        </button>
      );
    }

    // Always show 6 rows (42 cells) for consistent height
    const totalCells = 42;
    const currentCells = days.length;
    const emptyCellsNeeded = totalCells - currentCells;

    for (let i = 0; i < emptyCellsNeeded; i++) {
      days.push(<div key={`padding-${i}`} className="w-10 h-10" />);
    }

    return days;
  };

  return (
    <div className="space-y-2" ref={datePickerRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-300 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Native date input for manual typing */}
        <input
          ref={inputRef}
          type="date"
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          required={required}
          className={`
            w-full px-4 py-3 pr-12
            bg-slate-800/30 backdrop-blur-sm 
            border border-slate-600/30 rounded-lg 
            text-white placeholder-slate-400 
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent
            transition-all duration-300
            ${error ? 'border-red-400 ring-1 ring-red-400' : ''}
            [&::-webkit-calendar-picker-indicator]:hidden
            [&::-webkit-inner-spin-button]:hidden
            [&::-webkit-clear-button]:hidden
          `}
        />
        
        {/* Calendar icon button */}
        <button
          type="button"
          onClick={handleCalendarToggle}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
          aria-label="Open calendar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Calendar Popup */}
        {isOpen && (
          <div className="fixed z-50 inset-0 flex items-start justify-center pt-20 pb-4 sm:pt-0 sm:items-center overflow-y-auto" style={{ pointerEvents: 'none' }}>
            <div className="relative w-full max-w-xs bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-4" style={{ pointerEvents: 'auto' }}>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handlePreviousMonth}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMonthPicker(!showMonthPicker);
                      setShowYearPicker(false);
                    }}
                    className="text-lg font-semibold text-white hover:text-red-400 transition-colors"
                  >
                    {getMonthName(month)}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowYearPicker(!showYearPicker);
                      setShowMonthPicker(false);
                    }}
                    className="text-lg font-semibold text-white hover:text-red-400 transition-colors"
                  >
                    {year}
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Month Picker */}
              {showMonthPicker && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {Array.from({ length: 12 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleMonthSelect(i)}
                      className={`
                        py-2 px-3 rounded-lg text-sm font-medium transition-colors
                        ${month === i 
                          ? 'bg-red-500 text-white' 
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        }
                      `}
                    >
                      {getMonthName(i).substring(0, 3)}
                    </button>
                  ))}
                </div>
              )}

              {/* Year Picker */}
              {showYearPicker && (
                <div className="grid grid-cols-4 gap-2 mb-4 max-h-64 overflow-y-auto">
                  {getYearOptions().map((yearOption) => (
                    <button
                      key={yearOption}
                      type="button"
                      onClick={() => handleYearSelect(yearOption)}
                      className={`
                        py-2 px-3 rounded-lg text-sm font-medium transition-colors
                        ${year === yearOption 
                          ? 'bg-red-500 text-white' 
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        }
                      `}
                    >
                      {yearOption}
                    </button>
                  ))}
                </div>
              )}

              {/* Calendar Grid */}
              {!showMonthPicker && !showYearPicker && (
                <>
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <div key={index} className="text-center text-xs font-semibold text-slate-400">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {renderCalendarDays()}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-300 mt-1" role="alert">{error}</p>
      )}
    </div>
  );
}

export default DatePicker;
