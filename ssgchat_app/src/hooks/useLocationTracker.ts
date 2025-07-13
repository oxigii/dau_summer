import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { getSpaceId } from '../utils/getSpaceId';
import { removeParticipant, addParticipant } from '../services/chatService';
import { saveRecentUser } from '../services/userService';
import { getManualJoinList } from '../utils/joinedRooms';

export function useLocationTracker(userId: string, nickname: string, deviceToken: string) {
  const prevSpaceId = useRef<string | null>(null);

  useEffect(() => {
    let locationWatcher: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('위치 권한이 거부되었습니다.');
        return;
      }

      locationWatcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 7000,
          distanceInterval: 5,
        },
        async (location) => {
          const { latitude, longitude } = location.coords;
          const currentSpaceId = getSpaceId(latitude, longitude);
          const manualRooms = await getManualJoinList();

          if (prevSpaceId.current !== currentSpaceId) {
            if (prevSpaceId.current && !manualRooms.includes(prevSpaceId.current)) {
              await removeParticipant(prevSpaceId.current, userId);
            }

            await addParticipant(currentSpaceId, userId, nickname);
            await saveRecentUser(userId, currentSpaceId, deviceToken);
            prevSpaceId.current = currentSpaceId;
          } else {
            await saveRecentUser(userId, currentSpaceId, deviceToken);
          }
        }
      );
    };

    startTracking();

    return () => {
      if (locationWatcher) {
        locationWatcher.remove();
      }
    };
  }, [userId, nickname, deviceToken]);
}

//=================================================================================
// // 의견 조율 전 코드
// import { useEffect, useRef } from 'react';
// import * as Location from 'expo-location';
// import { getSpaceId } from '../utils/getSpaceId';
// import { removeParticipant, addParticipant } from '../services/chatService';
// import { saveRecentUser } from '../services/userService';

// export function useLocationTracker(userId: string, nickname: string, deviceToken: string) {
//   const prevSpaceId = useRef<string | null>(null);

//   useEffect(() => {
//     let locationWatcher: Location.LocationSubscription | null = null;

//     const startTracking = async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         console.warn('위치 권한이 거부되었습니다.');
//         return;
//       }

//       locationWatcher = await Location.watchPositionAsync(
//         {
//           accuracy: Location.Accuracy.High,
//           timeInterval: 7000,
//           distanceInterval: 5,
//         },
//         async (location) => {
//           const { latitude, longitude } = location.coords;
//           const currentSpaceId = getSpaceId(latitude, longitude);

//           if (prevSpaceId.current !== currentSpaceId) {
//             if (prevSpaceId.current) {
//               await removeParticipant(prevSpaceId.current, userId);
//             }

//             await addParticipant(currentSpaceId, userId, nickname);
//             await saveRecentUser(userId, currentSpaceId, deviceToken);

//             prevSpaceId.current = currentSpaceId;
//           } else {
//             await saveRecentUser(userId, currentSpaceId, deviceToken);
//           }
//         }
//       );
//     };

//     startTracking();

//     return () => {
//       if (locationWatcher) {
//         locationWatcher.remove();
//       }
//     };
//   }, [userId, nickname, deviceToken]);
// }