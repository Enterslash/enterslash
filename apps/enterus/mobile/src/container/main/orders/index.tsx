import { useUserStore } from '../../../store/userStore';
import { isProvider } from '../../../utils';
import ProviderChatOptions from './provider';
import ConsumerChatOptions from './consumer';
import Private from '../../../components/Private';

const ChatOptions = () => {
  const { user } = useUserStore();
  const userType = user?.userType;
  const provider = isProvider(userType);
  if (provider) {
    return <ProviderChatOptions />;
  } else {
    return <ConsumerChatOptions />;
  }
};

const PrivateChatOptions = () => {
  return (
    <Private>
      <ChatOptions />
    </Private>
  );
};

export default PrivateChatOptions;
