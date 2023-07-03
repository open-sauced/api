export enum UserNotificationTypes {
  Welcome = "welcome",
  HighlightReaction = "highlight_reaction",
  Follow = "follow",
}

export const userNotificationTypes = ["highlight_reaction", "follow"] as const;
