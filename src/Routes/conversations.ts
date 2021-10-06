import Conversations from '../Components/Conversations/Conversations';
import SingleConversation from '../Components/Conversations/SingleConversation';

export const ConversationsRoutes = {
  Component: Conversations,
  url: '/conversations',
  exact: true,
  permission: true,
};
export const ConversationRoute = {
  Component: SingleConversation,
  url: '/single-conversation/:id/:name',
  exact: true,
  permission: true,
};
