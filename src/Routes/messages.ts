import Messages from '../Messages/Messages';
import SingleConversation from '../Messages/SingleConversation';

export const MessagesRoutes = {
  component: Messages,
  url: '/messages',
  exact: true,
};
export const ConversationRoute = {
  component: SingleConversation,
  url: '/messages/:id',
  exact: true,
};
