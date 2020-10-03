import React, { Component } from 'react';
import '../Css/Signup.css'
import { registerUser } from '../api/apiService'
import { getToken } from '../api/AuthServices'
import { Link } from 'react-router-dom';

class SignUP extends Component {

    constructor() {
        super()
        this.state = {
            username: "",
            password: "",
            birthdate: "",
            gender: "male",
            email: "",
            country: "",
            area: "",
            city: "",
            street: "",
            pincode: "",
            role: "admin"
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getToken()
    }

    getToken(){
        getToken().then((data)=>{
            console.log("-------------- Token Details ---------------", data)
            let access_token = data.access_token
            localStorage.setItem("secretkey",access_token)
        })
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    radioMaleInputChange(event) {
        this.setState({
          gender: event.currentTarget.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        registerUser(this.state).then((data) => {
            if (data.status == 200) {
                return data.json()
            } else if (data.status == 401) {
                alert("wrong credentials")
                throw data
            } else {
                this.returnHome()
            }
        }).then((data)=>{
            localStorage.setItem("islogin",true)
            localStorage.setItem("userid",data.id)
            this.props.history.push("/home")
        }).catch(err => {
            this.returnHome()
        })
    }
    
    render() {
        return (
            <form>
              <h1>Do Sign Up in  Movie World</h1>
                <div className="container">
                    <label for="username"><strong>Username</strong></label>
                    <input type="text" name="username" value={this.state.username} placeholder="Enter your Username" onChange={this.handleInputChange} required />
                </div>

                <div className="container">
                    <label for="password"><strong>Password</strong></label>
                    <input type="password" name="password" value={this.state.password} placeholder="Enter your Password" onChange={this.handleInputChange} required />
                </div>

                <div className="container">
                    <label for="uname"><strong>Birthdate</strong></label><br/>
                    <input type="date" name="birthdate" value={this.state.birthdate} placeholder="Select your Birthdate" onChange={this.handleInputChange} required />
                </div>

                <div className="container">
                    <label for="uname"><strong>Email</strong></label><br/>
                    <input type="text" name="email" value={this.state.email} placeholder="Enter your Email" onChange={this.handleInputChange} required />
                </div>

                <div className="container">
                    <label for="uname"><strong>Country</strong></label><br/>
                    <input type="text" name="country" value={this.state.country} placeholder="Enter your Country" onChange={this.handleInputChange} required />
                </div>

                <div className="container">
                    <label for="uname"><strong>Area</strong></label><br/>
                    <input type="text" name="area" value={this.state.area} placeholder="Enter your Area" onChange={this.handleInputChange} required />
                </div>

                <div className="container">
                    <label for="uname"><strong>City</strong></label><br/>
                    <input type="text" name="city" value={this.state.city} placeholder="Enter your City" onChange={this.handleInputChange} required />
                </div>

                <div className="container">
                    <label for="uname"><strong>Street</strong></label><br/>
                    <input type="text" name="street" value={this.state.street} placeholder="Enter your Street" onChange={this.handleInputChange} required />
                </div>

                <div className="container">
                    <label for="uname"><strong>Pincode</strong></label><br/>
                    <input type="text" name="pincode" value={this.state.pincode} placeholder="Enter your Pincode" onChange={this.handleInputChange} required />
                </div>

                <div className="container">
                    <label for="uname"><strong>Gender</strong></label> &nbsp; &nbsp;
                    <input type="radio" name="gender" value="male" checked={this.state.gender === "male"} onChange={this.handleInputChange} required /> Male &nbsp;
                    <input type="radio" name="gender" value="female" checked={this.state.gender === "female" } onChange={this.handleInputChange} required /> Female
                </div>

                <div className="container">
                    <label for="uname"><strong>Role</strong></label> &nbsp; &nbsp;
                    <input type="radio" name="role" value="admin" checked={this.state.role === "admin"} onChange={this.handleInputChange} required /> Admin &nbsp;
                    <input type="radio" name="role" value="user" checked={this.state.role === "user" } onChange={this.handleInputChange} required /> User
                </div>

                <button type="submit" onClick={this.handleSubmit}><strong>Sign Up</strong></button>

                <Link to='/login'>
                    <button type="button" ><strong>Home</strong></button>
                </Link>
            </form>
        )
    }
}
export default SignUP;