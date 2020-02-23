import request from "@/utils/request";

export function fetchList(query) {
  return request({
    url: "/v1/sys-user",
    method: "get",
    params: query
  });
}

export function createUser(data) {
  return request({
    url: "/v1/sys-user",
    method: "post",
    data
  });
}

export function updateUser(data) {
  return request({
    url: `/v1/sys-user/${data.id}`,
    method: "put",
    data
  });
}

export function deleteUser(id) {
  return request({
    url: `/v1/sys-user/${id}`,
    method: "delete"
  });
}

