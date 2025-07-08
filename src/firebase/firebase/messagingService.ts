import messaging from '@react-native-firebase/messaging';

// FCM 권한 요청
export const requestUserPermission = async () => {
  const authorizationStatus = await messaging().requestPermission();
  if (authorizationStatus) {
    const token = await messaging().getToken();
    console.log('FCM Token:', token); // 이 토큰을 서버로 보내 푸시 알림을 전송할 수 있습니다.
  }
};

// 푸시 알림 수신
export const onMessageListener = () => {
  messaging().onMessage(async remoteMessage => {
    console.log('FCM Message Data:', remoteMessage.data);
    // 푸시 알림이 오면 처리할 코드 추가
  });
};
