import React, { Component } from "react";
import "../Css/Signup.css";
import { registerUser } from "../api/apiService";
import { authenticateLogin } from "../api/apiService";
import { getToken } from "../api/AuthServices";
import { Link } from "react-router-dom";

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getToken();
  }

  getToken() {
    getToken().then((data) => {
      console.log("-------------- Token Details ---------------", data);
      let access_token = data.access_token;
      localStorage.setItem("secretkey", access_token);
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  radioMaleInputChange(event) {
    this.setState({
      gender: event.currentTarget.value,
    });
  }

  returnHome(){
    this.props.history.push('/')
}   

  handleSubmit(event) {
    event.preventDefault();
    authenticateLogin(this.state)
      .then((data) => {
        if (data.status == 200) {
          return data.json();
        } else if (data.status == 401) {
          alert("wrong credentials");
          throw data;
        } else {
          this.returnHome();
        }
      })
      .then((data) => {
        localStorage.setItem("islogin", true);
        localStorage.setItem("userid", data.id);
        localStorage.setItem("username", data.username);
        this.props.history.push("/home");
      })
      .catch((err) => {
        this.returnHome();
      });
  }

  render() {
    return (
      <form>
        <h1>Welcome to the Movie World</h1>

        <div className="container">
          <label for="username">
            <strong>UserName</strong>
          </label>
          <input
            type="text"
            name="username"
            value={this.state.username}
            placeholder="Enter Your Username"
            onChange={this.handleInputChange}
            required
          />
        </div>

        <div className="container">
          <label for="password">
            <strong>Password</strong>
          </label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            placeholder="Enter your Password"
            onChange={this.handleInputChange}
            required
          />
        </div>
        <button type="submit" onClick={this.handleSubmit}>
          <strong>Sign In</strong>
        </button>

        <Link to="/login">
          <button type="button">
            <strong>Home Page</strong>
          </button>
        </Link>
      </form>
    );
  }
}
export default SignIn;