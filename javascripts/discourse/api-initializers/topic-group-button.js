import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  const currentUser = api.getCurrentUser();

  api.registerTopicFooterButton({
    id: "discourse-topic-group-button",
    priority: 0,
    icon() {
      if (settings.topic_group_button_icon.length) {
        return settings.topic_group_button_icon;
      }
    },
    translatedLabel() {
      return settings.topic_group_button_label;
    },
    translatedTitle() {
      return settings.topic_group_button_title;
    },
    action() {
      const topicButtonUrl = settings.topic_group_button_url;
      const url = topicButtonUrl
        .replace("<TOPIC_ID>", this.get("topic.id"))
        .replace("<USER_ID>", currentUser.id)
        .replace("<USERNAME>", currentUser.username)
        .replace("<TOPIC_TITLE>", this.get("topic.title"))
        .replace("<TOPIC_SLUG>", this.get("topic.slug"));

      window.open(url, "_blank");
    },
    dropdown() {
      return this.site.mobileView;
    },
    classNames: ["discourse-topic-group-button"],
    dependentKeys: ["topic.id", "topic.slug", "topic.title"],
    displayed() {
      if (!settings.topic_group_button_enabled) {
        return false;
      }

      if (currentUser.staff) {
        return true;
      }

      const userGroups = (currentUser.groups || []).map((g) =>
        g.name.toLowerCase()
      );
      const allowedGroup =
        settings.topic_group_button_allowed_group.toLowerCase();

      return userGroups.includes(allowedGroup);
    },
  });
});
