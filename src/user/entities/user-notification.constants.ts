export enum UserNotificationTypes {
  Welcome = "welcome",
  HighlightReaction = "highlight_reaction",
  HighlightCreated = "highlight_created",
  Follow = "follow",
}

export const userNotificationTypes = ["highlight_reaction", "highlight_created", "follow"] as const;
