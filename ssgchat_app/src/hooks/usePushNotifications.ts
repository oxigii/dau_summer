import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { requestNotifications } from 'react-native-permissions';
import { addRoomToManualJoinList } from '../utils/joinedRooms';

export const usePushNotifications = (navigation) => {
  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('✅ Push notification permission granted.');
      } else {
        console.warn('❌ Push notification permission denied.');
      }
    };

    if (Platform.OS === 'ios') {
      requestNotifications(['alert', 'sound']).then(({ status }) => {
        if (status !== 'granted') {
          console.warn('iOS 알림 권한 거부됨');
        }
      });
    }

    requestPermission();

    const unsubscribe = messaging().onNotificationOpenedApp(async (remoteMessage) => {
      if (remoteMessage?.data?.room_id && remoteMessage?.data?.space_id) {
        const { room_id: spaceId } = remoteMessage.data;

        Alert.alert(
          '질문 도착',
          '이 공간에서 질문이 도착했어요. 참여하시겠어요?',
          [
            { text: '무시하기', style: 'cancel' },
            {
              text: '입장하기',
              onPress: async () => {
                await addRoomToManualJoinList(spaceId);
                navigation.navigate('Chat', { spaceId });
              },
            },
          ]
        );
      }
    });

    return () => unsubscribe();
  }, [navigation]);
};

//=================================================================================
// // 의견 조율 전 코드
// import { useEffect } from 'react';
// import messaging from '@react-native-firebase/messaging';
// import { Alert, Platform } from 'react-native';
// import { requestNotifications } from 'react-native-permissions';

// export const usePushNotifications = (navigation) => {
//   useEffect(() => {
//     // ✅ 1. 푸시 권한 요청 (iOS 포함)
//     const requestPermission = async () => {
//       const authStatus = await messaging().requestPermission();
//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       if (enabled) {
//         console.log('✅ Push notification permission granted.');
//       } else {
//         console.warn('❌ Push notification permission denied.');
//       }
//     };

//     if (Platform.OS === 'ios') {
//       requestNotifications(['alert', 'sound']).then(({ status }) => {
//         if (status !== 'granted') {
//           console.warn('iOS 알림 권한 거부됨');
//         }
//       });
//     }

//     requestPermission();

//     // ✅ 2. 알림 클릭 시 팝업 띄우기
//     const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
//       if (remoteMessage?.data?.room_id && remoteMessage?.data?.space_id) {
//         const { room_id: spaceId } = remoteMessage.data;

//         Alert.alert(
//           '질문 도착',
//           '이 공간에서 질문이 도착했어요. 참여하시겠어요?',
//           [
//             { text: '무시하기', style: 'cancel' },
//             { text: '입장하기', onPress: () => navigation.navigate('Chat', { spaceId }) },
//           ]
//         );
//       }
//     });

//     return () => unsubscribe();
//   }, [navigation]);
// };