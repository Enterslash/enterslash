import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Layout,
  AppBar,
  FileInputBox,
  Space,
  Select,
  Text,
  BottomAction,
  Button,
  useMessageModal,
  Status,
  StatusType,
} from '@enterslash/react-native-ui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationStack, RouteStack } from '../../../navigation/root';
import { css } from '@enterslash/enterus/utils';
import { DocumentType, ProviderRequestStatus } from '@enterslash/enterus/types';
import { snackToNormalText } from '@enterslash/utils';
import { generateFile, image_picker } from '@enterslash/react-native-utils';
import { useHttp } from '../../../hook/useHttp';
import {
  get_provider_request_details,
  request_to_be_a_provider,
} from '@enterslash/enterus/http-client';

const statusColor = {
  [ProviderRequestStatus.PENDING]: StatusType.PENDING,
  [ProviderRequestStatus.ACCEPTED]: StatusType.APPROVED,
  [ProviderRequestStatus.REJECTED]: StatusType.CANCELED,
};

const options = Object.keys(DocumentType).map((key) => ({
  label: snackToNormalText(DocumentType[key]),
  value: key,
}));

const BeProvider = () => {
  const navigation = useNavigation<NavigationStack>();
  const [selectedOption, setSelectedOption] = useState<DocumentType>(null);
  const { showMessage } = useMessageModal();

  const { loading, request } = useHttp(() => {
    return request_to_be_a_provider({
      backImage: generateFile(images.back),
      frontImage: generateFile(images.front),
      idType: selectedOption,
    });
  });

  const { data: requestDetails, request: getRequestDetails, loading: loadData } = useHttp(() => {
    return get_provider_request_details();
  });

  useEffect(() => {
    getRequestDetails().then((res) => {
      if (res) {
        setSelectedOption(res.document.documentType);
        setImages({
          front: res.document.front,
          back: res.document.back,
        });
      }
    });
  }, []);

  const [images, setImages] = useState({
    front: undefined,
    back: undefined,
  });

  const handleImage = async (type: 'front' | 'back') => {
    if (!requestDetails) {
      const imageData = await image_picker.gallery({
        width: 640,
        height: 480,
      });
      setImages((prev) => ({
        ...prev,
        [type]: imageData.path,
      }));
    }
  };

  const handleSubmit = () => {
    request().then((res) => {
      if (res) {
        showMessage('Your request has been sent successfully', 'success');
        navigation.goBack();
      }
    });
  };

  return (
    <Layout>
      <AppBar title={'Provider Identity'} />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginHorizontal: css.padding.md }}>
          <Select
            options={options}
            onSelect={(s) => {
              setSelectedOption(s);
            }}
            value={selectedOption}
            label={'Select your ID type'}
          />
          {selectedOption && (
            <>
              <Space height={20} />
              <Text subtitle size={15}>
                Upload the front page of your ID
              </Text>
              <Space height={10} />
              <FileInputBox
                source={images.front}
                height={180}
                width="100%"
                onPress={() => handleImage('front')}
              />
              <Space height={20} />
              <Text subtitle size={15}>
                Upload the back page of your ID
              </Text>
              <Space height={10} />
              <FileInputBox
                source={images.back}
                height={180}
                width="100%"
                onPress={() => handleImage('back')}
              />
            </>
          )}
        </View>
        <Space height={20} />
      </ScrollView>
      <BottomAction>
        {requestDetails ? (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text bold>Request Status</Text>
            <Status
              type={statusColor[requestDetails.status]}
              title={requestDetails.status}
            />
          </View>
        ) : (
          <Button disabled={loadData} onPress={handleSubmit} loader={loading}>
            Submit
          </Button>
        )}
      </BottomAction>
    </Layout>
  );
};

export default BeProvider;
