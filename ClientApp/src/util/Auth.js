﻿import auth0 from 'auth0-js';
import { auth0Settings, claimsKey } from './clientInfo';
import history from './history';

export default class Auth {
  auth0 = new auth0.WebAuth(auth0Settings);

  constructor() { 
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.renewSession = this.renewSession.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication(setUserData, setLoading) {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult, setUserData, setLoading);
      } else if (err) {
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
        setLoading(false);
      }
    });
  }

  setSession(authResult, setUserData, setLoading) {
    // Set isLoggedIn flag in localStorage
    window.location.hash = '';
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('idToken', authResult.idToken);

    // Set the time that the Access Token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    localStorage.setItem('expiresAt', expiresAt);

    this.setUserInfo(authResult.accessToken, setUserData,setLoading);
  }

  setUserInfo(accessToken, setUserData, setLoading) {
    fetch(`https://${auth0Settings.domain}/userinfo`,
      { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(res => res.json())
      .then(data => {
        data.roles = data[claimsKey + 'roles'];
        data.permissions = data[claimsKey + 'permissions'];
        setUserData({ ...data, authenticated:true });
        setLoading(false);
      });
  }

  renewSession(setUserData, setLoading) {
    console.log('renewsession');
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log('renewing session');
        this.setSession(authResult, setUserData, setLoading);
      }
      else if (err) {
        this.logout(setUserData, setLoading);
        console.log(err);
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
      }
    });
  }

  logout(setUserData, setLoading) {
    // Remove tokens and expiry time
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('expiresAt');

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');

    this.auth0.logout({
      returnTo: window.location.origin
    });

    setUserData({ authenticated: false, roles: [], permissions: [] });
    setLoading(false);
    history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = localStorage.getItem('expiresAt');
    if (expiresAt) {
      return new Date().getTime() < expiresAt;
    }
    return false;
  }

}