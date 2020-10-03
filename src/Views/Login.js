import React, { Component } from "react";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import "../Css/Signup.css";
import { registerUser } from "../api/apiService";
import { authenticateLogin } from "../api/apiService";
import { getToken } from "../api/AuthServices";
import SignUP from "./SignUP";
import SignIn from "./SignIn";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onclick = this.onclick.bind(this);
    this.onsignInclick = this.onsignInclick.bind(this);
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

  onclick(event) {
    event.preventDefault();
    this.props.history.push("/signup");
  }
  onsignInclick(event) {
    event.preventDefault();
    this.props.history.push("/signin");
  }
  returnHome() {
    this.props.history.push("/");
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

        <button type="submit" onClick={this.onsignInclick}>
          <strong>Sign In</strong>
        </button>

        <button type="button" onClick={this.onclick}>
          <strong>Sign Up</strong>
        </button>
      </form>
    );
  }
}
export default Login;