import { AppRegistry } from 'react-native';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import RootNavigation, { RootStackParamList } from './src/navigation/root';
import {
  AlertInitializer,
  AppLoader,
  MessageModalProvider,
} from '@enterslash/react-native-ui';
import { useAppStore } from './src/store/appStore';
import { StripeProvider } from '@stripe/stripe-react-native';
import {
  configureNotification,
  createNotificationChannel,
  registerBackgroundHandler,
  registerForegroundHandler,
  requestUserPermission,
} from '@enterslash/react-native-utils';
import {
  AppLinks,
  merchant_identifier,
  publishable_key,
} from '@enterslash/enterus/utils';
import CodePush from 'react-native-code-push';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['https://enterus.co', 'enterus://'],
  config: {
    screens: {
      main: {
        screens: {
          orders: AppLinks.order(),
          home: AppLinks.root(),
          settings: AppLinks.settings(),
        },
      },
      chatOptions: AppLinks.chatOptions(),
      message: AppLinks.message(),
    },
  },
};

createNotificationChannel();
registerBackgroundHandler();
configureNotification();
requestUserPermission();
registerForegroundHandler();

const App = () => {
  const { loading } = useAppStore();

  return (
    <StripeProvider
      publishableKey={publishable_key}
      merchantIdentifier={merchant_identifier}
    >
      <NavigationContainer linking={linking}>
        {loading && <AppLoader />}
        <MessageModalProvider>
          <RootNavigation />
        </MessageModalProvider>
        <AlertInitializer />
      </NavigationContainer>
    </StripeProvider>
  );
};

const CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  updateDialog: {
    appendReleaseDescription: true,
    title: 'New update is available!',
  },
};

const Main = CodePush(CodePushOptions)(App);

AppRegistry.registerComponent('Enterus', () => Main);
