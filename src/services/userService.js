import ApiService from "./apiService";
const URL = process.env.REACT_APP_BASE_API_URL;

class UserService {
    
   addTask (data) {
    return ApiService.post(`${URL}task/addTask`, {
      name: data.name,
      parentTaskId: data.parentTaskId,
    });
  }

  listTasks () {
    return ApiService.get(`${URL}task/listTasks`);
  }

  getTaskDetailById (id) {
    return ApiService.get(`${URL}task/id/${id}`);
  }

  updateTask (id) {
    return ApiService.get(`${URL}task/id/${id}`);
  }
}

export default new UserService();
