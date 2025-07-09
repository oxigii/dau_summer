import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';  // 경로가 올바른지 확인
import { useLocationTracker } from './src/hooks/useLocationTracker'; // 위치 추적 훅
import { requestUserPermission, onMessageListener } from './src/firebase/messagingService'; // FCM 관련 함수

export default function App() {
  const [hasPermission, setHasPermission] = useState(false); // 푸시 알림 권한 상태 관리

  useLocationTracker(); // 위치 추적 시작

  useEffect(() => {
    // 앱 시작 시 푸시 알림 권한 요청 및 수신 준비
    const getPermission = async () => {
      const permission = await requestUserPermission();  // 권한 요청
      setHasPermission(permission); // 권한 상태 업데이트
    };

    getPermission(); // 권한 요청 실행

    // FCM 메시지 리스너 시작
    onMessageListener();

  }, []); // 빈 배열을 넣어 컴포넌트가 마운트될 때만 실행

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
