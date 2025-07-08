import messaging from '@react-native-firebase/messaging';

// 푸시 알림 권한 요청
export const requestUserPermission = async () => {
  const authorizationStatus = await messaging().requestPermission();
  if (authorizationStatus) {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);  // 이 토큰을 서버로 전송하여 푸시 알림을 보낼 수 있습니다.
  }
};

// 푸시 알림 수신
export const onMessageListener = () => {
  messaging().onMessage(async remoteMessage => {
    console.log('푸시 알림 데이터:', remoteMessage.data);
    // 푸시 알림이 오면 처리할 코드 추가
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('푸시 알림 클릭:', remoteMessage);
    // 알림 클릭 후 앱 열기 처리
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('백그라운드에서 메시지 처리:', remoteMessage);
    // 백그라운드에서 알림 처리
  });
};
