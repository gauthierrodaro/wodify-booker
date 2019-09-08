export const slackMessages = {
  success: date => ({
    attachments: [
      {
        title: "Successfully booked wod 💪",
        title_link: "https://app.wodify.com/Membership/Attendance.aspx",
        color: "good",
        fields: [
          {
            title: "Date",
            value: `${date.format("DD/MM/YYYY")}`,
            short: true
          }
        ]
      }
    ]
  }),
  warning: date => ({
    attachments: [
      {
        title: `The wod was not booked wod ⚠️`,
        title_link: "https://app.wodify.com/Membership/Attendance.aspx",
        color: "warning",
        fields: [
          {
            title: "Date",
            value: `${date.format("DD/MM/YYYY")}`,
            short: true
          }
        ]
      }
    ]
  }),
  error: (date, error) => ({
    attachments: [
      {
        title: `Failed to book wod 🚨`,
        title_link: "https://app.wodify.com/Membership/Attendance.aspx",
        color: "danger",
        fields: [
          {
            title: "Error",
            value: `${error}`,
            short: true
          },
          {
            title: "Date",
            value: `${date.format("DD/MM/YYYY")}`,
            short: true
          }
        ]
      }
    ]
  })
}
