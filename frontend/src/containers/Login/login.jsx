import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Authentication from 'modules/authentication/authentication';
import { loggedInUser } from './login.action';
import Http from 'modules/ajaxCalls';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayname: '',
            username: 'jason',
            password: 'test',
            loginStatus: true,
            loginMsg: ''
        };
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }
    componentDidMount() {
        Authentication.removeToken();
    }
    login() {
        Http.post('/login', {}, JSON.stringify({
            username: this.state.username,
            password: this.state.password
        })
        ).then((res) => {
            this.loginDone(res);
        }).catch((err) => {
            this.setState({
                loginStatus: false,
                loginMsg: err.message
            });
        });
    }
    register() {
        Http.post('/register', {}, JSON.stringify({
            displayname: this.state.displayname,
            username: this.state.username,
            password: this.state.password
        })
        ).then((res) => {
            this.loginDone(res);
        }).catch((err) => {
            this.setState({
                loginStatus: false,
                loginMsg: err.message
            });
        });
    }
    loginDone(res) {
        if (res.loginSuccess) {
            this.setState({
                loginStatus: true,
                loginMsg: ''
            });
            Authentication.setToken({
                token: res.token,
                created: new Date().getTime(),
                expired: res.expired
            });
            
            this.props.dispatch(loggedInUser(res.user));

            this.props.history.push('/');
        } else {
            this.setState({
                loginStatus: false, //todo, store username
                loginMsg: res.message
            });
        }
    }
    render() {
        return (
            <div style={loginForm}>
                <div>
                    <div style={mainDiv}>
                        <div className='panel'>
                            <h2 style={panelH2}>Login</h2>
                            <p style={panelP}>Please enter your username and password</p>
                        </div>
                        <form id='Login'>
                            <div style={loginForm_formGroup}>
                                <input type='text' className='form-control' style={loginForm_formControl} placeholder='Display Name (Optional)' value={this.state.displayname}
                                    onChange={(e) => this.setState({ displayname: e.target.value })} />
                            </div>
                            <div style={loginForm_formGroup}>
                                <input type='text' className='form-control' style={loginForm_formControl} placeholder='User Name' value={this.state.username}
                                    onChange={(e) => this.setState({ username: e.target.value })} />
                            </div>
                            <div style={loginForm_formGroup}>
                                <input type='password' className='form-control' style={loginForm_formControl} placeholder='Password' value={this.state.password}
                                    onChange={(e) => this.setState({ password: e.target.value })} />
                            </div>
                            <div style={{ textAlign: 'left', marginBottom: '30px' }}>
                                <a style={forgotA} href='reset.html'>Forgot password?</a>
                            </div>
                            <button type='button' className='btn btn-primary' onClick={() => this.login()} style={loginForm_btn_btnPrimary}>Login</button>
                            <button type='button' className='btn btn-primary' onClick={() => this.register()} style={loginForm_btn_btnPrimary}>Register</button>
                            <div style={{ textAlign: 'left', marginTop: '0' }} className={this.state.loginStatus ? "hide" : "text-danger"}>
                                {this.state.loginMsg}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Login);


const loginForm = {
    backgroundImage: 'url("https://hdwallsource.com/img/2014/9/blur-26347-27038-hd-wallpapers.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    padding: '10px',
    height: '100vh'
};

const panelH2 = {
    color: '#444444',
    fontSize: '18px',
    margin: '0 0 8px 0'
};

const panelP = {
    color: '#777777',
    fontSize: '14px',
    marginBottom: '30px',
    lineHeight: '24px'
};

const loginForm_formControl = {
    background: '#f7f7f7 none repeat scroll 0 0',
    border: '1px solid #d4d4d4',
    borderRadius: '4px',
    fontSize: '14px',
    height: '50px',
    lineHeight: '50px'
};
const mainDiv = {
    background: '#ffffff none repeat scroll 0 0',
    borderRadius: '2px',
    margin: '10px auto 30px',
    maxWidth: '25%',
    padding: '50px 70px 70px 71px',
    textAlign: 'center'
};

const loginForm_formGroup = {
    marginBottom: '10px'
};

const forgotA = {
    color: '#777777',
    fontSize: '14px',
    textDecoration: 'underline'
};

const loginForm_btn_btnPrimary = {
    background: '#f0ad4e none repeat scroll 0 0',
    borderColor: '#f0ad4e',
    color: '#ffffff',
    fontSize: '14px',
    width: '100%',
    height: '50px',
    lineHeight: '50px',
    padding: '0',
    marginBottom: '10px'
};

const loginForm_btn_btnPrimary_reset = {
    background: '#ff9900 none repeat scroll 0 0'
};

