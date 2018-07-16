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
export async function queryCurrent() {
  return request(`${prefix}/auth/user/current-user`);
}

/**
 * 登录
 */
export async function accountLogin(param) {
  return request(`${prefix}/s/login`, { method: 'POST', body: param });
}
export async function accountLogout() {
  return request(`${prefix}/s/logout`);
}

/**
 * 验证码
 */
export async function sendEmailCaptcha(sendTo) {
  return request(`${prefix}/sys/captcha/email?sendTo=${sendTo}`);
}
export async function sendMobileCaptcha(sendTo) {
  return request(`${prefix}/sys/captcha/mobile?sendTo=${sendTo}`);
}

/**
 * 商品分类
 */
export async function findCategoryList(param) {
  return request(`${prefix}/shop/${param.userId}/category`);
}
export async function saveCategory(param) {
  return request(`${prefix}/shop/${param.userId}/category`, { method: 'POST', body: param });
}
export async function removeCategory(param) {
  return request(`${prefix}/shop/${param.userId}/category/${param.id}`, { method: 'DELETE' });
}
export async function changeCategoryStatus(param) {
  return request(`${prefix}/shop/${param.userId}/category/${param.id}/change-status`);
}
export async function changeCategoryRecommend(param) {
  return request(`${prefix}/shop/${param.userId}/category/${param.id}/change-recommend`);
}

/**
 * 商品品牌
 */
export async function findBrandList(param) {
  return request(`${prefix}/shop/${param.userId}/brand?${stringify(param)}`);
}
export async function findBrandListNoPage(param) {
  return request(`${prefix}/shop/${param.userId}/brand/no-page`);
}
export async function saveBrand(param) {
  return request(`${prefix}/shop/${param.userId}/brand`, { method: 'POST', body: param });
}
export async function removeBrand(param) {
  return request(`${prefix}/shop/${param.userId}/brand/${param.id}`, { method: 'DELETE' });
}
export async function changeBrandShow(param) {
  return request(`${prefix}/shop/${param.userId}/brand/${param.id}/change-show`);
}

/**
 * 商品供应商
 */
export async function findSupplierList(param) {
  return request(`${prefix}/shop/${param.userId}/supplier?${stringify(param)}`);
}
export async function findSupplierListNoPage(param) {
  return request(`${prefix}/shop/${param.userId}/supplier/no-page`);
}
export async function saveSupplier(param) {
  return request(`${prefix}/shop/${param.userId}/supplier`, { method: 'POST', body: param });
}
export async function removeSupplier(param) {
  return request(`${prefix}/shop/${param.userId}/supplier/${param.id}`, { method: 'DELETE' });
}
export async function changeSupplierStatus(param) {
  return request(`${prefix}/shop/${param.userId}/supplier/${param.id}/change-status`);
}

/**
 * 商品
 */
export async function findGoodsList(param) {
  return request(`${prefix}/shop/${param.userId}/goods?${stringify(param)}`);
}
export async function findGoodsTrashList(param) {
  return request(`${prefix}/shop/${param.userId}/goods/trash?${stringify(param)}`);
}
export async function findGoodsOne(param) {
  return request(`${prefix}/shop/${param.userId}/goods/${param.id}`);
}
export async function saveGoods(param) {
  return request(`${prefix}/shop/${param.userId}/goods`, { method: 'POST', body: param });
}
export async function removeGoods(param) {
  return request(`${prefix}/shop/${param.userId}/goods/${param.id}`, { method: 'DELETE' });
}
export async function changeGoodsStatus(param) {
  return request(`${prefix}/shop/${param.userId}/goods/${param.id}/change-status?statusEnum=${param.statusEnum}`);
}
