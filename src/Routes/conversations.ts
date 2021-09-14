import Conversations from '../components/Conversations/Conversations';
import SingleConversation from '../components/Conversations/SingleConversation';

export const ConversationsRoutes = {
  component: Conversations,
  url: '/conversations',
  exact: true,
  permission: true,
};
export const ConversationRoute = {
  component: SingleConversation,
  url: '/single-conversation/:id/:name',
  exact: true,
  permission: true,
};
