import {
  updateRecentUser,
  getRecentUsersInSpace
} from '../firebase/firestoreService';

// 현재 위치를 기반으로 recentUsers 업데이트
export const saveRecentUser = async (userId, spaceId, deviceToken) => {
  return updateRecentUser(userId, spaceId, deviceToken);
};

// 최근 5분 내 같은 공간 사용자 목록 조회
export const fetchNearbyRecentUsers = async (spaceId) => {
  return getRecentUsersInSpace(spaceId);
};