import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

// 푸시 알림 권한 요청 함수
export const requestUserPermission = async () => {
  try {
    // iOS에서만 권한 요청
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      return enabled;
    } else {
      // Android는 권한이 자동으로 허용됨
      return true;
    }
  } catch (error) {
    console.error('푸시 알림 권한 요청 실패', error);
    return false;
  }
};

// 푸시 알림 수신 리스너 설정 함수
export const onMessageListener = () => {
  // 포그라운드에서 푸시 메시지를 받을 때 처리
  messaging().onMessage(async remoteMessage => {
    console.log('푸시 메시지 수신:', remoteMessage);
    // 메시지를 처리하는 코드 추가 (예: 알림 표시 등)
  });

  // 앱이 백그라운드에 있을 때 푸시 메시지 클릭
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('백그라운드에서 알림 클릭:', remoteMessage);
    // 클릭 후 동작 처리
  });

  // 앱이 종료되었을 때 수신된 메시지 처리
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('백그라운드에서 메시지 처리:', remoteMessage);
    // 백그라운드에서 처리할 메시지 로직 추가
  });
};

// FCM 토큰 가져오기 및 저장
export const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    // FCM 토큰을 Firestore나 서버에 저장하는 로직 추가
    return token;
  } catch (error) {
    console.error('FCM 토큰 가져오기 실패', error);
  }
};
