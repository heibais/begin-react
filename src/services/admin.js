import request from '../utils/request';
import { stringify } from 'qs';

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

/**
 * 菜单管理
 */
export async function findAuthList() {
  return request(`${prefix}/auth/permission`);
}
export async function removeAuth(id) {
  return request(`${prefix}/auth/permission/${id}`, { method: 'DELETE' });
}
export async function saveAuth(param) {
  return request(`${prefix}/auth/permission`, { method: 'POST', body: param });
}
export async function changeAuthStatus(id) {
  return request(`${prefix}/auth/permission/${id}/change-status`);
}

/**
 *  角色管理
 */
export async function findRoleList() {
  return request(`${prefix}/auth/role`);
}
export async function findSimpleRoleList() {
  return request(`${prefix}/auth/role/simple`);
}
export async function removeRole(id) {
  return request(`${prefix}/auth/role/${id}`, { method: 'DELETE' });
}
export async function saveRole(param) {
  return request(`${prefix}/auth/role`, { method: 'POST', body: param });
}
export async function changeRoleStatus(id) {
  return request(`${prefix}/auth/role/${id}/change-status`);
}
export async function findPermissionTree() {
  return request(`${prefix}/auth/permission/tree`);
}
export async function savePermissions(param) {
  return request(`${prefix}/auth/role/savePermissions`, { method: 'POST', body: param });
}

/**
 * 用户管理
 */
export async function findCurrent() {
  return request(`${prefix}/auth/user/currentUser`);
}
export async function findUserList(param) {
  return request(`${prefix}/auth/user?${stringify(param)}`);
}
export async function removeUser(id) {
  return request(`${prefix}/auth/user/${id}`, { method: 'DELETE' });
}
export async function saveUser(param) {
  return request(`${prefix}/auth/user`, { method: 'POST', body: param });
}
export async function changeUserStatus(id) {
  return request(`${prefix}/auth/user/${id}/change-status`);
}
export async function changeUserPwd(param) {
  return request(`${prefix}/auth/user/${param.userId}/change-pwd`, { method: 'POST', body: param });
}
export async function saveUserRole(param) {
  return request(`${prefix}/auth/user/${param.userId}/save-role`, { method: 'POST', body: param });
}
