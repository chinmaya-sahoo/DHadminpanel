/**
 * Utility functions for date formatting
 */

/**
 * Format date from API response
 * Handles custom date formats from API:
 * - "24 Sep, 2025 14:10 PM" (with time)
 * - "22 Sep, 2025" (date only)
 * @param {string} dateString - Date string from API
 * @returns {string} Formatted date string or 'N/A' if invalid
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    let parsedDate;

    if (dateString.includes(',')) {
      const parts = dateString.split(', ');
      if (parts.length === 2) {
        const datePart = parts[0]; // "24 Sep" or "22 Sep"
        const timePart = parts[1]; // "2025 14:10 PM" or "2025"

        // Check if time part contains time information
        if (timePart.includes(' ')) {
          // Format with time: "24 Sep, 2025 14:10 PM"
          const dateTimePart = timePart.split(' ');
          if (dateTimePart.length >= 3) {
            const year = dateTimePart[0]; // "2025"
            const time = dateTimePart[1]; // "14:10"
            const ampm = dateTimePart[2]; // "PM"

            // Convert 24-hour format to 12-hour format for JavaScript parsing
            const [hours, minutes] = time.split(':');
            const hour24 = parseInt(hours, 10);
            const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
            const time12 = `${hour12}:${minutes}`;

            const reformattedDate = `${datePart}, ${year} ${time12} ${ampm}`;
            parsedDate = new Date(reformattedDate);
          } else {
            parsedDate = new Date(dateString);
          }
        } else {
          // Format without time: "22 Sep, 2025"
          const year = timePart; // "2025"
          const reformattedDate = `${datePart}, ${year}`;
          parsedDate = new Date(reformattedDate);
        }
      } else {
        parsedDate = new Date(dateString);
      }
    } else {
      // Standard format
      parsedDate = new Date(dateString);
    }

    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date';
    }

    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Format date with time from API response
 * Handles custom date formats from API:
 * - "24 Sep, 2025 14:10 PM" (with time)
 * - "22 Sep, 2025" (date only - will show 12:00 AM)
 * @param {string} dateString - Date string from API
 * @returns {string} Formatted date and time string or 'N/A' if invalid
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    let parsedDate;

    if (dateString.includes(',')) {
      const parts = dateString.split(', ');
      if (parts.length === 2) {
        const datePart = parts[0]; // "24 Sep" or "22 Sep"
        const timePart = parts[1]; // "2025 14:10 PM" or "2025"

        // Check if time part contains time information
        if (timePart.includes(' ')) {
          // Format with time: "24 Sep, 2025 14:10 PM"
          const dateTimePart = timePart.split(' ');
          if (dateTimePart.length >= 3) {
            const year = dateTimePart[0]; // "2025"
            const time = dateTimePart[1]; // "14:10"
            const ampm = dateTimePart[2]; // "PM"

            // Convert 24-hour format to 12-hour format for JavaScript parsing
            const [hours, minutes] = time.split(':');
            const hour24 = parseInt(hours, 10);
            const hour12 = hour24 > 12 ? hour24 - 12 : (hour24 === 0 ? 12 : hour24);
            const time12 = `${hour12}:${minutes}`;

            const reformattedDate = `${datePart}, ${year} ${time12} ${ampm}`;
            parsedDate = new Date(reformattedDate);
          } else {
            parsedDate = new Date(dateString);
          }
        } else {
          // Format without time: "22 Sep, 2025" - will default to 12:00 AM
          const year = timePart; // "2025"
          const reformattedDate = `${datePart}, ${year}`;
          parsedDate = new Date(reformattedDate);
        }
      } else {
        parsedDate = new Date(dateString);
      }
    } else {
      parsedDate = new Date(dateString);
    }

    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date';
    }

    return parsedDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return 'Invalid Date';
  }
};
