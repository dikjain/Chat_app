export const formatDateIST = (timestamp) => {
  return new Date(timestamp)
    .toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
    .split('/')
    .map(num => num.padStart(2, '0'))
    .join('/');
};

export const formatTimeIST = (timestamp) => {
  return new Date(timestamp)
    .toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })
    .split(':')
    .map(num => num.padStart(2, '0'))
    .join(':');
};

export const getTodayIST = () => {
  return new Date()
    .toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    .slice(0, 9);
};

export const formatDateTime = (timestamp) => {
  const date = formatDateIST(timestamp);
  const time = formatTimeIST(timestamp);
  return `${date} - ${time}`;
};

export const formatMessageTime = (createdAt, todayIST) => {
  const formatted = formatDateTime(createdAt);
  const messageDate = formatted.slice(0, 9);
  const isToday = messageDate === todayIST;
  
  if (isToday) {
    // Show only time for today's messages
    const hour = Number(formatted.slice(13, 15));
    return hour > 9 
      ? formatted.slice(13, 17) + formatted.slice(20, 24)
      : formatted.slice(13, 17) + formatted.slice(20, 24);
  } else {
    // Show date and time for older messages
    const day = Number(formatted.slice(11, 14));
    return day > 9
      ? formatted.slice(0, 9) + " -" + formatted.slice(11, 17) + formatted.slice(20, 23)
      : formatted.slice(0, 11) + formatted.slice(11, 16) + formatted.slice(19, 24);
  }
};

