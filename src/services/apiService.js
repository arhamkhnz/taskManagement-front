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
            alert("Error in PUT API");
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
            alert("Error in PUT API");
          }
        }
      );
    });
  }

  async put(url, data) {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = JSON.stringify(token);
    return new Promise(async function (resolve, reject) {
      await axios({
        method: "put",
        url: url,
        data,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log(err);
          if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
          ) {
            message.warn(err.response.data.message);
          } else {
            alert("Error in PUT API");
          }
        });
    });
  }
}

export default new ApiService();
