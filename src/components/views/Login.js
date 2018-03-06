import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import users from '../../const/users'
import {FormField} from '/components/styled/Form'
import Input from '/components/styled/Input'
import Button from '/components/styled/Button'
import {localStorageSet} from '../../api/browser'
import state from '../../store/state'

export default class Login extends Component {
	
	constructor(props) {

    super(props);
    this.state = {
			login: '',
			password: '',
			input_error: '',
			access_error: '',
		};

		this.handleChangeLogin = this.handleChangeLogin.bind(this);
		this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleChangeLogin(event) {
		const value = event.target.value.trim();
		this.setState({login: value});
	}

	handleChangePassword(event) {
		const value = event.target.value.trim();
		this.setState({password: value});
	}
	
	handleSubmit(event) {
		event.preventDefault();
	
		if(this.state.login.length > 0 && this.state.password.length > 0) {
			
			this.setState({input_error: ''});
			
			let result = users.filter((data) => {
				return this.validateAccess(data);
			});

			if(result.length) {
				
				localStorageSet('profile', JSON.stringify(result));
				state.isLoggedIn = true;

			} else {
				this.setState({access_error: "invalid data"});
			}

		} else {
			this.setState({input_error: "field is required"});
		}
	}

	validateAccess(data) {
		if(data.login == this.state.login && data.password == this.state.password) {
			delete data.password;
			return data;
		}
		return false;
	}
	
	render(props, {login, password, input_error, access_error}) {
		return (
			<Container>
				<FormField>
					<Error>{access_error}</Error>
					<Input
						placeholder="Login"
						value={login}
						onChange={this.handleChangeLogin} 
						error={input_error}
						invalid={input_error && login.length == 0}
						width="100%"
						type="text"
					/>
				</FormField>
				<FormField>
					<Input
						placeholder="Password"
						width="100%"
						type="password"
						value={password}
						onChange={this.handleChangePassword} 
						error={input_error}
						invalid={input_error && password.length == 0}
					/>
				</FormField>
				<FormField>
						<Button
							width="100%"
							onClick={this.handleSubmit}
						>
							Log in
						</Button>
				</FormField>
			</Container>
		);
	}
}

const Container = styled.div`
  max-width: 550px;
	margin: 100px auto 0 auto;
	padding-top: 20px;
`
const Error = styled.div `
	color: ${styles.color.error};
	font-size: 15px;
	text-transform: uppercase;
	padding: 10px;
`