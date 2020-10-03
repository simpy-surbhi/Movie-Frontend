import React, { Component } from 'react'
import { detailsMovie } from '../api/apiService'
import '../Css/DetailsMovie.css'
import 'font-awesome/css/font-awesome.min.css'
import StarRatings from 'react-star-ratings'
import io from 'socket.io-client';
import SocketIOClient from 'socket.io-client';
import { browserHistory } from 'react-router';
class DetailsMovie extends Component {

    idMovie = -1
    constructor(props) {
        super(props)
        this.idMovie = props.match.params.idMovie
        this.state = {
            dataMovie: {},
            rating: 0.0,
            comment: "",
            comments: [],
            ratingData:{},
            socket: io('http://192.168.0.38:3001', { query: `movieId=${this.idMovie}&userid=${localStorage.getItem("userid")}` })
        }

        this.submitComment = this.submitComment.bind(this)
        this.changeRating = this.changeRating.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state.socket.removeAllListeners()

        this.state.socket.on('connect', ()=> {
            console.log("Socket Connected")
            this.getRatings()
            this.seenMovie()
        });

        this.state.socket.on('disconnect',()=> {
            console.log("Socket Disconnected")
        });

        this.state.socket.on(`getComment${this.idMovie}`,(data)=> {
            if(data){
                var proto = Object.getPrototypeOf(data);
                if (proto === Array.prototype) {
                    console.log(data)
                    this.setState({comments:data})
                } else {
                    this.setState({comments:[...this.state.comments,data]})
                }
            }
        })
    }

    seenMovie(){
        let json = {
            "userid": localStorage.getItem("userid"),
            "movieid": `${this.idMovie}`
        }
    
        this.state.socket.emit("SeenMovie", json, (data)=> {
            if (data.status == 200){
                debugger;
                console.log(data)
            }
        });
    }

    getRatings(){
        
        this.state.socket.on(`getRatings${this.idMovie}`,(data)=> {
            if(data !== undefined){
                this.setState({
                    ratingData:data
                })
            }

            if(this.state.ratingData.isenable == "0"){
                this.setState({
                    rating: 0.0
                })
            }else{
                this.setState({
                    rating: data.ratings
                })
            }
        })
    }


    componentDidMount() {
        this.getDetails()
    }

    componentDidUpdate(){    
        window.onpopstate = e => {
           //your code...
           this.state.socket.removeAllListeners()
           this.state.socket.disconnect()
        }
      }
      

    returnHome() {
        this.props.history.push('/')
    }

    getDetails() {
        detailsMovie(this.idMovie).then((data) => {
            if (data.status == 200) {
                return data.json()
            } else if (data.status == 401) {
                throw data
            } else {
                throw data
            }
        }).then((data) => {
            console.log(data)
            this.setState({
                dataMovie: data
            })
        }).catch(err => {
            this.returnHome()
        })
    }

    returnData(data) {
        this.setState({"comment":""})
    }

    submitComment() {
        let json = {
            "title": localStorage.getItem("username"),
            "comment": this.state.comment,
            "userid": localStorage.getItem("userid"),
            "movieid": this.idMovie
        }
        this.state.socket.emit("addcomment", json, (data)=> {
            this.returnData(data)
        });
    }

    changeRating(newRating) {

        let json = {
            "rating":`${newRating}`,
            "userid": localStorage.getItem("userid"),
            "movieid": `${this.idMovie}`
        }

        this.state.socket.emit("addratings", json, (data)=> {
            if (data.status == 200){
                console.log(data)
            }
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    renderdetails() {
        return (
            <div id="wrapperdetails">
                <div id="c1details" style={{ color: 'white' }}>
                    <br />
                    <h1 style={{ textShadow: '2px 2px 5px red' }}>{this.state.dataMovie.title}</h1>
                    <img class="poster" src={this.state.dataMovie.imageLink} />
                    <div style={{ marginLeft: '5%', marginTop: '5%' }}>

                        <div style={{ marginBottom: '20px' }}>
                            <h5><b>Details: </b></h5><h6>{this.state.dataMovie.details}</h6>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <h5 style={{ display: 'inline-block' }}><b> Release Date: </b></h5> <h6 style={{ display: 'inline-block' }}>{this.state.dataMovie.releaseDate}</h6>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h5 style={{ display: 'inline-block' }}><b>  Movie Type:  </b></h5> <h6 style={{ display: 'inline-block' }}>{this.state.dataMovie.category}</h6>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <h5 style={{ display: 'inline-block' }}><b>  Movie Director:  </b></h5> <h6 style={{ display: 'inline-block' }}>{this.state.dataMovie.movieDirector}</h6>
                        </div>
                    </div>
                    <div style={{ marginLeft: '30px', marginRight: '30px', pointerEvents: `${this.state.ratingData.isenable == "1" ? "none" : "auto"}` }}>
                        <span class="heading"><b>User Rating</b></span>
                        <StarRatings
                            rating={this.state.rating}
                            starRatedColor="blue"
                            changeRating={this.changeRating}
                            numberOfStars={5}
                            starDimension="40px"
                            starHoverColor="blue"
                            name='rating'
                        />
                        <p>{this.state.ratingData.ratings} rate based on {this.state.ratingData.totalcount} ratings.</p>
                        <hr style={{ border: '3px solid #f1f1f1' }} />

                        <div class="row" >
                            <div class="side">
                                <div>5 star</div>
                            </div>
                            <div class="middle">
                                <div class="bar-container">
                                    <div class="bar-5" style={{width: `${(this.state.ratingData.five*100)/this.state.ratingData.totalcount}%`, height: '18px', backgroundColor: '#4CAF50'}}></div>
                                </div>
                            </div>
                            <div class="side right">
        <                   div>{this.state.ratingData.five}</div>
                            </div>
                            <div class="side">
                                <div>4 star</div>
                            </div>
                            <div class="middle">
                                <div class="bar-container">
                                    <div class="bar-4" style={{width: `${(this.state.ratingData.four*100)/this.state.ratingData.totalcount}%`, height: '18px', backgroundColor: '#ff9800'}}></div>
                                </div>
                            </div>
                            <div class="side right">
                                <div>{this.state.ratingData.four}</div>
                            </div>
                            <div class="side">
                                <div>3 star</div>
                            </div>
                            <div class="middle">
                                <div class="bar-container">
                                    <div class="bar-3" style={{width: `${(this.state.ratingData.three*100)/this.state.ratingData.totalcount}%`, height: '18px', backgroundColor: '#00bcd4'}}></div>
                                </div>
                            </div>
                            <div class="side right">
                                <div>{this.state.ratingData.three}</div>
                            </div>
                            <div class="side">
                                <div>2 star</div>
                            </div>
                            <div class="middle">
                                <div class="bar-container">
                                    <div class="bar-2" style={{width: `${(this.state.ratingData.two*100)/this.state.ratingData.totalcount}%`, height: '18px', backgroundColor: '#ff9800'}}></div>
                                </div>
                            </div>
                            <div class="side right">
                                <div>{this.state.ratingData.two}</div>
                            </div>
                            <div class="side">
                                <div>1 star</div>
                            </div>
                            <div class="middle">
                                <div class="bar-container">
                                    <div class="bar-1" style={{width: `${(this.state.ratingData.one*100)/this.state.ratingData.totalcount}%`, height: '18px', backgroundColor: '#f44336'}}></div>
                                </div>
                            </div>
                            <div class="side right">
                                <div>{this.state.ratingData.one}</div>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>

                <div id="c2details" style={{ color: "white" }}>
                    <br />
                    <h1 style={{ textShadow: '2px 2px 5px red' }}>Comments</h1>
                    <div id="wrapperdetails" style={{ marginLeft: '10%' }}>
                        <div id="cleftsearch">
                            <input class="oneSub" type="text" value={this.state.comment} name="comment" placeholder="Write comment" style={{ height: '55px' }} onChange={this.handleInputChange} required />
                        </div>
                        <div id="crightsearch">
                            <button onClick={this.submitComment}>Submit</button>
                        </div>
                    </div>
                    <div class="CommentList">
                        { this.state.comments.length > 0 ? this.renderCommentBubble() : <div>No Comments </div> }
                    </div>
                </div>
            </div>
        )
    }

    renderCommentBubble() {
        return this.state.comments.map((comment) =>
            <div class="commentbubble">
                <div style={{ height: '15px' }}></div>
                    <h5><b>{comment.title}</b></h5>
                    <p>
                        {comment.comment}
                    </p>
                <div style={{ height: '1px' }}></div>
            </div>
        )
    }

    renderError() {
        return <div id="AlertDiv"><h1> Sorry 😢 No movie available </h1></div>
    }


    render() {
        return (
            <div class="mainbody">
                <div>
                    {!this.isEmpty(this.state.dataMovie) ? this.renderdetails() : this.renderdetails()}
                </div>
            </div>
        )
    }
}


export default DetailsMovie;