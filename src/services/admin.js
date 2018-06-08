import request from '../utils/request';

const prefix = '/hyb/v1';
/** 部门 */
export async function findDeptList() {
  return request(`${prefix}/auth/dept`);
}

export async function removeDept(id) {
  return request(`${prefix}/auth/dept/${id}`, { method: 'DELETE' });
}

export async function saveDept(param) {
  return request(`${prefix}/auth/dept`, { method: 'POST', body: param });
}

export async function changeDeptStatus(id) {
  return request(`${prefix}/auth/dept/${id}/change-status`);
}
