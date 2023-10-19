import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt from "jsonwebtoken";

import axios from 'axios';
import { serverUrl } from '../../apis/serverUrl';

export const Profile = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem('token');
	const [studyId, setStudyId] = useState('');
	// const [role, setRole] = useState('');
	const [ NPassword, setNPassword] = useState('');
	const [ CNPassword, setCNPassword] = useState('');
	useEffect(() => {
		if (token) {
			const decoded = jwt.decode(JSON.parse(token))
			setStudyId(decoded.studyId)
			// setRole(decoded.role);
		} else {
			navigate('/login');
		}
	}, [token, navigate]);

	const updatePassword = () => {
		if( NPassword === CNPassword && NPassword !== ''){
			axios.post(serverUrl + '/user/updatepassword',{
				studyId: studyId,
				password: NPassword
			}).then(res => {
				if(res.data.success){
					navigate('/home');
				}
			})
		}
	}

	return (
		<div>
			<div class="loader-bg">
				<div class="loader-track">
					<div class="loader-fill"></div>
				</div>
			</div>
			<nav class="pcoded-navbar" style={{ left: 0 }}>
				<div class="navbar-wrapper">
					<div class="navbar-brand header-logo">
						<a href="home" class="b-brand">
							<div class="b-bg">
								<img src="favicon.png" width="60" height="60"></img>
							</div>
							<span class="b-title">PAP App</span>
						</a>
						<a class="mobile-menu" id="mobile-collapse" href="javascript:"><span></span></a>
					</div>
					<div class="navbar-content scroll-div">
						<ul class="nav pcoded-inner-navbar">
							<li class="nav-item pcoded-menu-caption">
								<label>Navigation</label>
							</li>
							<li class="nav-item active">
								<a href="home" class="nav-link "><span class="pcoded-micon"><i class="feather icon-home"></i></span><span class="pcoded-mtext">Dashboard</span></a>
							</li>
							<li class="nav-item pcoded-menu-caption">
								<label>Forms</label>
							</li>
							<li class="nav-item pcoded-hasmenu">
								<a href="javascript:" class="nav-link "><span class="pcoded-micon"><i class="feather icon-file-text"></i></span><span class="pcoded-mtext">Available Forms</span></a>
								<ul class="pcoded-submenu">
									<li class=""><a href="dailyform" class="">Daily Form</a></li>
									<li class=""><a href="weeklyform" class="">Weekly Form</a></li>
								</ul>
							</li>
							<li class="nav-item pcoded-menu-caption">
								<label>Activity Statistics</label>
							</li>
							<li class="nav-item"><a href="usergraphs" class="nav-link "><span class="pcoded-micon"><i class="feather icon-pie-chart"></i></span><span class="pcoded-mtext">Data Visualization</span></a></li>
						</ul>
					</div>
				</div>
			</nav>

			<header class="navbar pcoded-header navbar-expand-lg navbar-light">
				<div class="m-header">
					<a class="mobile-menu" id="mobile-collapse1" href="javascript:"><span></span></a>
					<a href="home" class="b-brand">
						<div class="b-bg">
							<img src="favicon.png" width="60" height="60" />
						</div>
						<span class="b-title">PAP App</span>
					</a>
				</div>
				<a class="mobile-menu" id="mobile-header" href="javascript:">
					<i class="feather icon-more-horizontal"></i>
				</a>
				<div class="collapse navbar-collapse">
					<ul class="navbar-nav ml-auto">
						<li>
							<div class="dropdown">
								{/* <a class="dropdown-toggle" href="javascript:" data-toggle="dropdown"><i class={this.state.notificonon}></i></a> */}
								<div class="dropdown-menu dropdown-menu-right notification">
									<div class="noti-head">
										<h6 class="d-inline-block m-b-0">Notifications</h6>
										<div class="float-right">
											{/* <a href="" onClick={this.handleclear}>clear all</a> */}
										</div>
									</div>
									<ul class="noti-body">
										<li>
											<div >
												<div>
													{/* <Notifications user_id={this.state.user_id} /> */}
												</div>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</li>
						<li>
							<div class="dropdown drp-user">
								<a href="javascript:" class="dropdown-toggle" data-toggle="dropdown">
									<i class="icon feather icon-settings"></i>
								</a>
								<div class="dropdown-menu dropdown-menu-right profile-notification" >
									<div class="pro-head">
										<img src="assets/images/user/userneutral.png" class="img-radius" alt="User-Profile-Image" />
										{/* <span>{this.state.user_id}</span> */}
									</div>
								</div>
							</div>
						</li>
						<li>
							<a href="" class="dud-logout" title="Logout">
								{/* <i class="feather icon-log-out" onClick={this.handlelogout}></i> */}
							</a>
						</li>
					</ul>
				</div>
			</header>


			<div class="pcoded-main-container">
				<div class="pcoded-wrapper">
					<div class="pcoded-content">
						<div class="pcoded-inner-content">
							<div class="main-body">
								<div class="page-wrapper">
									<div class="row">
										<div class="col-xl-4 col-md-4 "></div>
										<div class="col-xl-5 col-md-5 ">
											<div class="card">
												<div class="card-body text-center">
													<div class="mb-4">
														<i class="feather icon-unlock auth-icon"></i>
													</div>
													<h3 class="mb-4">Update password</h3>
													<div class="input-group mb-3">
														<input
															type="text"
															className="form-control"
															name="username"
															value={studyId}
															disabled
														/>
													</div>
													<div class="input-group mb-4">
														<input
															type="password"
															className="form-control"
															name="NPassword"
															placeholder="New password"
															// disabled={this.state.loading}
															value={NPassword}
															onChange={(e) => setNPassword(e.target.value)}
															minLength={8}
														/>
													</div>
													<div class="input-group mb-4">
														<input
															type="password"
															className="form-control"
															name="CNPassword"
															placeholder="Confirm new password"
															// disabled={this.state.loading}
															value={CNPassword}
															onChange={(e) => setCNPassword(e.target.value)}
															minLength={8}
														/>
													</div>
													<button class="btn btn-primary shadow-2 mb-4" onClick={(event) => updatePassword(event)}>Update password</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}