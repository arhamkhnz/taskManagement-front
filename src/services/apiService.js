import { message } from "antd";
import axios from "axios";

class ApiService {
  get(url) {
    return new Promise(function (resolve, reject) {
      axios.get(url).then(
        (response) => {
          resolve(response);
        },
        (err) => {
          if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
          ) {
            message.info(err.response.data.message);
          } else {
            alert("Error in GET API");
          }
        }
      );
    });
  }

  post(url, data) {
    return new Promise(function (resolve, reject) {
      axios.post(url, data).then(
        (response) => {
          resolve(response);
        },
        (err) => {
          if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
          ) {
            message.info(err.response.data.message);
          } else {
            alert("Error in POST API");
          }
        }
      );
    });
  }
}

export default new ApiService();
