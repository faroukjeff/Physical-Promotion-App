import axios from "axios";
import { serverUrl } from "../../apis/serverUrl";

const API_URL = serverUrl + "/user/login/";

class AuthService {
  login(studyId, password) {
    return axios
      .post(API_URL, {
        studyId,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("token", JSON.stringify(response.data.accessToken));
          localStorage.setItem("firstLogin", JSON.stringify(response.data.firstLogin));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.clear();
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();