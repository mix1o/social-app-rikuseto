import Conversations from '../Conversations/Conversations';
import SingleConversation from '../Conversations/SingleConversation';

export const ConversationsRoutes = {
  component: Conversations,
  url: '/conversations',
  exact: true,
};
export const ConversationRoute = {
  component: SingleConversation,
  url: '/single-conversations/:id/:name',
  exact: true,
};
