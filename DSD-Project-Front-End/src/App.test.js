import { render, screen } from "@testing-library/react";
import App from "./App";
import ReactDOM from "react-dom";
import SupervisorPanel from "./components/supervisorPanel/SupervisorPanel";
import Formdisplay from "./components/form/FormDisplay";
import Login from "./components/login/login";
import HomePage from "./components/home/home";
import { createBrowserHistory } from "history";
import Notifications from "./components/Notifications/Notifications";

const history = createBrowserHistory();

describe("Rendering Components", () => {
  test("Supervisor panel renders without crashing", () => {
    // render(<SupervisorPanel />);
    const div = document.createElement("div");
    ReactDOM.render(<SupervisorPanel history={history} />, div);
  });

  test("Login Page renders without crashing", () => {
    // render(<SupervisorPanel />);
    const div = document.createElement("div");
    ReactDOM.render(<Login history={history} />, div);
  });

  test("Home page renders without crashing", () => {
    // render(<SupervisorPanel />);
    const div = document.createElement("div");
    ReactDOM.render(<HomePage history={history} />, div);
  });

  test("Forms page renders without crashing", () => {
    // render(<SupervisorPanel />);
    const div = document.createElement("div");
    ReactDOM.render(<Formdisplay history={history} />, div);
  });

  test("Notification component renders without crashing", () => {
    // render(<SupervisorPanel />);
    const div = document.createElement("div");
    ReactDOM.render(<Notifications />, div);
  });
});
