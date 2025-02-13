// Function to format date as "February 2nd"
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = date.getDate()

  // Add ordinal suffix (st, nd, rd, th)
  const suffix =
    day === 1 || day === 21 || day === 31
      ? 'st'
      : day === 2 || day === 22
        ? 'nd'
        : day === 3 || day === 23
          ? 'rd'
          : 'th'

  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)

  return `${month} ${day}${suffix}`
}
