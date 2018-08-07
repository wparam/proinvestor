import React, {Component} from 'react';

const loginForm = {
    backgroundImage: 'url("https://hdwallsource.com/img/2014/9/blur-26347-27038-hd-wallpapers.jpg")', 
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center', 
    backgroundSize: 'cover',
    padding:'10px',
    height: '100vh'
};

const panelH2 = {
    color:'#444444', 
    fontSize:'18px',
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
  marginBottom:'10px'
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

export default class Login extends Component{
    render(){
        return (
            <div style={loginForm}>
                <div>
                    <div style={mainDiv}>
                        <div className='panel'>
                            <h2 style={panelH2}>Admin Login</h2>
                            <p style={panelP}>Please enter your email and password</p>
                        </div>
                        <form id='Login'>
                            <div style={loginForm_formGroup}>
                                <input type='email' className='form-control' style={loginForm_formControl} id='inputEmail' placeholder='Email Address' />
                            </div>
                            <div style={loginForm_formGroup}>
                                <input type='password' className='form-control' style={loginForm_formControl} id='inputPassword' placeholder='Password' />
                            </div>
                            <div style={{ textAlign: 'left', marginBottom: '30px' }}>
                                <a style={forgotA} href='reset.html'>Forgot password?</a>
                            </div>
                            <button type='submit' className='btn btn-primary' style={loginForm_btn_btnPrimary}>Login</button>
                            <button type='submit' className='btn btn-primary' style={loginForm_btn_btnPrimary}>Register</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

