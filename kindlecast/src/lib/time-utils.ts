export function getTimeBasedGreeting(): { greeting: string; emoji: string } {
  const now = new Date()
  const hour = now.getHours()

  if (hour >= 5 && hour < 12) {
    return { greeting: 'Good morning', emoji: '🌅' }
  } else if (hour >= 12 && hour < 17) {
    return { greeting: 'Good afternoon', emoji: '☀️' }
  } else if (hour >= 17 && hour < 21) {
    return { greeting: 'Good evening', emoji: '🌆' }
  } else {
    return { greeting: 'Good night', emoji: '🌙' }
  }
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}
