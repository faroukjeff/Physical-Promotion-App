import React, { Component } from "react";
import authService from "./auth.service";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

class AuthVerify extends Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
    const decodedJwt = parseJwt(user.accessToken);
    if (decodedJwt.exp * 1000 < Date.now()) {
        authService.logout()
        const { history } = this.props;
        history.push("/login");
        window.location.reload();
    }
    }

  }

  render() {
    return <div></div>;
  }
}

export default AuthVerify;