import React, { Component } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import AuthService from "./auth.service";
import axios from "axios";
import { serverUrl } from "../../apis/serverUrl";



const required = value => {
	if (!value) {
		return (
			<div className="alert alert-danger" role="alert">
				This field is required!
			</div>
		);
	}
};

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.state = {
			username: "",
			password: "",
			loading: false,
			message: "",
			fromlog: false,
			role: "",
			firstLogin: false,
			NPassword: "",
			CNPassword: "",
		};
	}

	componentDidMount() {

		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			const decodedJwt = Promise.resolve(this.parseJwt(user.accessToken));
			decodedJwt.then((value) => {
				if (!value.firstLogin) {
					const { history } = this.props;
					if (value.role === "patient") {
						history.push("/home");
					} else if (value.role === "supervisor") {
						history.push("/superdash");
					}
					window.location.reload();
				}
			})
		}
		if (this.props.history.location.search === "?redirecttologin") {
			this.setState({ fromlog: true });
		}
	}

	onChangeUsername(e) {
		this.setState({
			username: e.target.value
		});
	}

	onChangePassword(e) {
		this.setState({
			password: e.target.value
		});
	}

	parseJwt = (token) => {
		try {
			return JSON.parse(atob(token.split('.')[1]));
		} catch (e) {
			return null;
		}
	};

	handleLogin(e) {
		e.preventDefault();

		this.setState({
			message: "",
			loading: true
		});

		this.form.validateAll();

		if (this.checkBtn.context._errors.length === 0) {
			AuthService.login(this.state.username, this.state.password).then(
				(res) => {
					const { firstLogin } = res;
					if (firstLogin || firstLogin === undefined) {
						this.setState({
							firstLogin: true,
							loading: false
						})
					} else {
						this.setState({
							firstLogin: false,
						})
						try {
							const decodedJwt = Promise.resolve(this.parseJwt(JSON.parse(localStorage.getItem("user")).accessToken));
							decodedJwt.then((value) => {
								this.setState({ role: value.role })
								//alert(value.role)
								const { history } = this.props;
								if (value.role === "patient") {
									history.push("/home");
								} else if (value.role === "supervisor") {
									history.push("/superdash");
								}
								window.location.reload();
							})
						} catch (e) { }
					}
				},
				error => {
					const resMessage =
						(error.response &&
							error.response.data &&
							error.response.data.message) ||
						error.message ||
						error.toString();

					this.setState({
						loading: false,
						message: resMessage
					});
				}
			);
		} else {
			this.setState({
				loading: false
			});
		}
	}

	updatePassword(e) {
		e.preventDefault();
		this.setState({ loading: false })
		if (this.state.NPassword === this.state.CNPassword) {
			axios.post(serverUrl + '/user/firstlogin', {
				password: this.state.CNPassword,
				studyId: this.state.username
			}).then(res => {
				if (res.data.success) {
					localStorage.setItem("firstLogin",false);
					const token = localStorage.getItem("token");
					if (token) {
						const decodedJwt = Promise.resolve(this.parseJwt(token));
						decodedJwt.then((value) => {
							const { history } = this.props;
							if (value.role === "patient") {
								history.push("/home");
							} else if (value.role === "supervisor") {
								history.push("/superdash");
							}
							window.location.reload();
						})
					}
				}
			})
		}
	}

	render() {
		return (
			<div className="col-md-12">
				<Form
					onSubmit={this.handleLogin}
					ref={c => {
						this.form = c;
					}}
				>
					<div class="auth-wrapper">
						<div class="auth-content">
							<div class="auth-bg">
								<span class="r"></span>
								<span class="r s"></span>
								<span class="r s"></span>
								<span class="r"></span>
							</div>
							{!this.state.firstLogin && (
								<div class="card">
									<div class="card-body text-center">
										<div class="mb-4">
											<i class="feather icon-unlock auth-icon"></i>
										</div>
										<h3 class="mb-4">Login</h3>
										<div class="input-group mb-3">
											<input
												type="text"
												placeholder="Study Id"
												className="form-control"
												name="username"
												value={this.state.username}
												onChange={this.onChangeUsername}
												validations={[required]} />
										</div>
										<div class="input-group mb-4">
											<input
												type="password"
												className="form-control"
												placeholder="Password"
												name="password"
												disabled={this.state.loading}
												value={this.state.password}
												onChange={this.onChangePassword}
												validations={[required]} />
										</div>
										<button class="btn btn-primary shadow-2 mb-4">Login</button>
										{this.state.loading && (
											<span className="spinner-border spinner-border-sm"></span>
										)}
										{this.state.message && (
											<div className="form-group">
												<div className="alert alert-danger" role="alert">
													{this.state.message}
												</div>
											</div>
										)}
										{this.state.fromlog && (
											<div className="form-group">
												<div className="alert alert-danger" role="alert">
													You need to be Logged In To Access the App
												</div>
											</div>
										)}
									</div>
								</div>
							)}
							{this.state.firstLogin && (
								<div class="card">
									<div class="card-body text-center">
										<div class="mb-4">
											<i class="feather icon-unlock auth-icon"></i>
										</div>
										<h3 class="mb-4">Login</h3>
										<div class="input-group mb-3">
											<input
												type="text"
												className="form-control"
												name="username"
												value={this.state.username}
												disabled
												validations={[required]} />
										</div>
										<div class="input-group mb-4">
											<input
												type="password"
												className="form-control"
												name="NPassword"
												placeholder="New password"
												disabled={this.state.loading}
												value={this.state.NPassword}
												onChange={(e) => this.setState({ NPassword: e.target.value })}
												minLength={8}
												validations={[required]} />
										</div>
										<div class="input-group mb-4">
											<input
												type="password"
												className="form-control"
												name="CNPassword"
												placeholder="Confirm new password"
												disabled={this.state.loading}
												value={this.state.CNPassword}
												onChange={(e) => this.setState({ CNPassword: e.target.value })}
												minLength={8}
												validations={[required]} />
										</div>
										<button class="btn btn-primary shadow-2 mb-4" onClick={(event) => this.updatePassword(event)}>Change password</button>
									</div>
								</div>
							)}
						</div>
					</div>
					<CheckButton
						style={{ display: "none" }}
						ref={c => {
							this.checkBtn = c;
						}}
					/>
				</Form>
			</div>
		);
	}
}