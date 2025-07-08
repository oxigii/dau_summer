// hooks/useLocationTracker.ts
import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { getSpaceId } from '../utils/getSpaceId';
import { removeParticipant, addParticipant } from '../services/chatService';
import { saveRecentUser } from '../services/userService'; // ✅ 수정된 userService 사용

export function useLocationTracker(userId: string, nickname: string, deviceToken: string) { // ✅ deviceToken 외부에서 받음
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

          if (prevSpaceId.current !== currentSpaceId) {
            // 공간이 바뀐 경우
            if (prevSpaceId.current) {
              await removeParticipant(prevSpaceId.current, userId);
            }

            await addParticipant(currentSpaceId, userId, nickname);
            await saveRecentUser(userId, currentSpaceId, deviceToken); // ✅ 수정된 함수 사용

            prevSpaceId.current = currentSpaceId;
          } else {
            // 같은 공간이면 recentUsers만 업데이트
            await saveRecentUser(userId, currentSpaceId, deviceToken); // ✅ 수정된 함수 사용
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
  }, [userId, nickname, deviceToken]); // ✅ 의존성 배열에 포함
}

// --------------------------------------------------------------------------------

// 수정 전(위의 코드가 안 될 시 테스트용)

// / hooks/useLocationTracker.ts
// import { useEffect, useRef } from 'react';
// import * as Location from 'expo-location';
// import { getSpaceId } from '../utils/getSpaceId';
// import { updateRecentUser, removeParticipant, addParticipant } from '../services/chatService';

// export function useLocationTracker() {
//   const prevSpaceId = useRef<string | null>(null);
//   const userId = 'user123';
//   const nickname = '익명펭귄17';

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
//           timeInterval: 7000, // 7초 간격
//           distanceInterval: 5, // 최소 5m 이동 시
//         },
//         async (location) => {
//           const { latitude, longitude } = location.coords;
//           const currentSpaceId = getSpaceId(latitude, longitude);

//           if (prevSpaceId.current !== currentSpaceId) {
//             // 공간이 바뀐 경우: 이전 공간에서 나가고 새 공간에 입장
//             if (prevSpaceId.current) {
//               await removeParticipant(prevSpaceId.current, userId);
//             }
//             await addParticipant(currentSpaceId, userId, nickname);
//             await updateRecentUser(currentSpaceId, userId);

//             prevSpaceId.current = currentSpaceId;
//           } else {
//             // 같은 공간일 경우 recentUsers만 업데이트
//             await updateRecentUser(currentSpaceId, userId);
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
//   }, []);
// }
