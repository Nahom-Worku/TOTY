// Calendar functionality
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Sample events data - can be replaced with actual events from backend/API
const events = [
    { date: '2025-04-26', title: 'Youth Night', description: 'An evening of fellowship, prayer, and discussion.' },
    { date: '2025-05-11', title: 'Volunteering Day', description: 'Serving our community together' },
    { date: '2025-06-22', title: 'Annual Conference', description: 'A day of worship, learning, and unity' }
];

function renderCalendar(month, year) {
    const calendarDays = document.getElementById('calendar-days');
    const monthYearDisplay = document.getElementById('calendar-month-year');

    // Clear previous calendar
    calendarDays.innerHTML = '';

    // Set month and year display
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay();

    // Get number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get number of days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    let dayElements = '';

    // Add days from previous month
    for (let i = firstDay; i > 0; i--) {
        const day = daysInPrevMonth - i + 1;
        dayElements += `<div class="calendar-day other-month"><span class="calendar-day-number">${day}</span></div>`;
    }

    // Add days of current month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() &&
                       month === today.getMonth() &&
                       year === today.getFullYear();

        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasEvent = events.some(event => event.date === dateString);

        const todayClass = isToday ? 'today' : '';
        const eventIndicator = hasEvent ? '<div class="calendar-day-event"></div>' : '';

        dayElements += `<div class="calendar-day ${todayClass}"><span class="calendar-day-number">${day}</span>${eventIndicator}</div>`;
    }

    // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
    const totalCellsFilled = firstDay + daysInMonth;
    const remainingCells = 42 - totalCellsFilled;

    for (let day = 1; day <= remainingCells; day++) {
        dayElements += `<div class="calendar-day other-month"><span class="calendar-day-number">${day}</span></div>`;
    }

    calendarDays.innerHTML = dayElements;
}


function renderUpcomingEvents() {
    const eventsList = document.getElementById('events-list');

    if (events.length === 0) {
        // Show "No upcoming events" message
        eventsList.innerHTML = `
            <div class="no-events">
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="80" height="80">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                </svg>
                <h3>No Upcoming Events</h3>
                <p>Check back soon for new events and fellowship opportunities!</p>
            </div>
        `;
    } else {
        // Filter and sort upcoming events
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = events
            .filter(event => new Date(event.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (upcomingEvents.length === 0) {
            eventsList.innerHTML = `
                <div class="no-events">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="80" height="80">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                    </svg>
                    <h3>No Upcoming Events</h3>
                    <p>Check back soon for new events and fellowship opportunities!</p>
                </div>
            `;
        } else {
            eventsList.innerHTML = upcomingEvents.map(event => {
                const eventDate = new Date(event.date);
                const day = eventDate.getDate();
                const month = monthNames[eventDate.getMonth()];
                const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][eventDate.getDay()];

                return `
                    <div class="event-item">
                        <div class="event-date">${dayOfWeek}, ${month} ${day}</div>
                        <div class="event-details">
                            <h3>${event.title}</h3>
                            <p>${event.description}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

// Navigation buttons
document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});

// Initial render
renderCalendar(currentMonth, currentYear);
renderUpcomingEvents();
