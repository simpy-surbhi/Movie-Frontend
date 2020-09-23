import React, { Component } from 'react'
import { detailsMovie } from '../api/apiService'
import '../Css/DetailsMovie.css'
import 'font-awesome/css/font-awesome.min.css'
import StarRatings from 'react-star-ratings'
import io from 'socket.io-client';
import SocketIOClient from 'socket.io-client';
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
            socket: io('http://localhost:3001', { query: `movieId=${this.idMovie}` })
        }

        this.submitComment = this.submitComment.bind(this)
        this.changeRating = this.changeRating.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state.socket.on('connect', ()=> {
            console.log("Socket Connected")
            
        });


        this.state.socket.on('disconnect',()=> {
            console.log("Socket Disconnected")
        });

        this.state.socket.on(`getComment${this.idMovie}`,(data)=> {
            var proto = Object.getPrototypeOf(data);
            if (proto === [].prototype) {
                this.setState({comments:data})
            } else {
                this.setState({comments:[...this.state.comments,data]})
            }
        })

        
    }


    componentDidMount() {
        // this.getDetails()
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
        debugger;
        this.setState({"comment":""})
    }

    submitComment() {
        let json = {
            "title": "vishal",
            "comment": this.state.comment,
            "userid": "1",
            "movieid": this.idMovie
        }
        this.state.socket.emit("addcomment", json, (data)=> {
            this.returnData(data)
        });

    }

    changeRating(newRating) {
        this.setState({
            rating: newRating
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
                    <div style={{ marginLeft: '30px', marginRight: '30px' }}>
                        <span class="heading"><b>User Rating</b></span>
                        <StarRatings
                            rating={this.state.rating}
                            starRatedColor="blue"
                            changeRating={this.changeRating}
                            numberOfStars={5}
                            starDimension="40px"
                            name='rating'
                        />
                        <p>4.1 average based on 254 reviews.</p>
                        <hr style={{ border: '3px solid #f1f1f1' }} />

                        <div class="row" >
                            <div class="side">
                                <div>5 star</div>
                            </div>
                            <div class="middle">
                                <div class="bar-container">
                                    <div class="bar-5"></div>
                                </div>
                            </div>
                            <div class="side right">
                                <div>150</div>
                            </div>
                            <div class="side">
                                <div>4 star</div>
                            </div>
                            <div class="middle">
                                <div class="bar-container">
                                    <div class="bar-4"></div>
                                </div>
                            </div>
                            <div class="side right">
                                <div>63</div>
                            </div>
                            <div class="side">
                                <div>3 star</div>
                            </div>
                            <div class="middle">
                                <div class="bar-container">
                                    <div class="bar-3"></div>
                                </div>
                            </div>
                            <div class="side right">
                                <div>15</div>
                            </div>
                            <div class="side">
                                <div>2 star</div>
                            </div>
                            <div class="middle">
                                <div class="bar-container">
                                    <div class="bar-2"></div>
                                </div>
                            </div>
                            <div class="side right">
                                <div>6</div>
                            </div>
                            <div class="side">
                                <div>1 star</div>
                            </div>
                            <div class="middle">
                                <div class="bar-container">
                                    <div class="bar-1"></div>
                                </div>
                            </div>
                            <div class="side right">
                                <div>20</div>
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
                    <p>{comment.title}</p>
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