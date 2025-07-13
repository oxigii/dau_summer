import {
  updateRecentUser,
  getRecentUsersInSpace,
} from './firestoreService';

// 최근 사용자 저장
export const saveRecentUser = async (userId, spaceId, deviceToken) => {
  return updateRecentUser(userId, spaceId, deviceToken);
};

// 최근 사용자 목록 조회
export const fetchNearbyRecentUsers = async (spaceId) => {
  return getRecentUsersInSpace(spaceId);
};
