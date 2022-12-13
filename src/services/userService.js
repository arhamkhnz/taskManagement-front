import ApiService from "./apiService";
const URL = process.env.REACT_APP_BASE_API_URL;

class UserService {
  addTask(data) {
    return ApiService.post(`${URL}task/addTask`, {
      name: data.name,
      parentId: data.parentId,
    });
  }

  listTasks() {
    return ApiService.get(`${URL}task/listTasks`);
  }

  getTaskDetailById(id) {
    return ApiService.get(`${URL}task/id/${id}`);
  }

  getChildTasksById(id) {
    return ApiService.get(`${URL}task/childTasks/${id}`);
  }

  updateStatus(id, data) {
    return ApiService.post(`${URL}task/updateStatus`, {
      id: id,
      status: data.status,
    });
  }

  updateTask(id, data) {
    return ApiService.post(`${URL}task/update`, {
      id: id,
      name: data.name,
      status: data.status,
      parentId: data.parentId,
    });
  }

  deleteTask(id) {
    return ApiService.post(`${URL}task/delete`, {
      id: id,
    });
  }
}

export default new UserService();
