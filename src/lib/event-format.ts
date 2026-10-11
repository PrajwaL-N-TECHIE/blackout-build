export const eventFormat = {
  totalHours: 8,
  initialInternetHours: 2,
  breakInternetHours: 1,
  buildInternetAccess: false,
  phases: [
    { title: 'Connect & explore', time: 'THE FIRST 2 HOURS', online: true, description: 'Research your idea, gather your resources, and get your team on the same wavelength.' },
    { title: 'Go dark. Build.', time: 'THE BLACKOUT BEGINS', online: false, description: 'The internet goes off. Your creativity stays on. Turn what you know into something real.' },
    { title: 'Recharge & reconnect', time: '1-HOUR INTERNET BREAK', online: true, description: 'Take a breath, get back online, and grab what you need for the final stretch.' },
    { title: 'Build & present', time: 'THE FINAL STRETCH', online: false, description: 'Go offline again, bring your idea across the finish line, and show us what you made.' },
  ],
} as const;