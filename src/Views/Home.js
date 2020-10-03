import React, { Component } from 'react';
import '../Css/Home.css'
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import { homeApi } from '../api/apiService'
class Home extends Component {


    constructor(props) {
        super(props);
        this.state = {
            search: "",
            recommandationData:[],
            newMovieData:[],
            lastSeenMovie:[],
            isenable: false
        }
        this.searchSubmit = this.searchSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.moveToDetails = this.moveToDetails.bind(this);
        this.getData()
    }

    getData(){
        let data = {"userid":localStorage.getItem("userid")}
        homeApi(data).then((data) => {
            debugger;
            if (data.status == 200) {
                return data.json()
            } else if (data.status == 401) {
                alert("wrong credentials")
                throw data
            } else {
                this.returnHome()
            }
        }).then((data)=>{
            this.setState({
                recommandationData:data.recommondationmovie,
                newMovieData:data.newMovie,
                lastSeenMovie:data.lastSeenMovies,
                isenable:true
            })
        }).catch(err => {
            this.returnHome()
        })
    }

    returnHome(){
        this.props.history.push('/')
    }


    searchSubmit(event){
        event.preventDefault();
        this.props.history.push(`/search/${this.state.search}`)
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    moveToDetails(event){
        const id = event.target.id;
        this.props.history.push(`/details/${id}`)        
    }

    render() {
        return (
            <div class="mainbody" style={{ pointerEvents:this.state.isenable ? "auto" : "none" }}>
                <br/>
                <div id="wrapper">
                    <div id="c1">
                        <label class="labelclass">Movie World</label>
                    </div>
                    <div id="c2">
                        <div id="wrapper">
                            <div id="c1" style={{width:"70%"}}>
                                <input class="oneSub" type="text" value={this.state.search} name="search" style={{marginTop:'10px',height:'50px'}}  placeholder="Search movie" onChange={this.handleInputChange} required/>
                            </div>
                            <div id="c2" style={{width:"30%"}}>
                                <button style={{height:'50px'}} onClick={this.searchSubmit}>Search</button>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div>
                
                    <AliceCarousel autoPlay autoPlayInterval="2000" fadeOutAnimation={true} buttonsDisabled={true} controlsStrategy="responsive">
                        <img src="https://s2.best-wallpaper.net/wallpaper/1920x1440/1204/Priest-movie-HD_1920x1440.jpg" className="sliderimg"/>
                        <img src="https://cdn.wallpapersafari.com/86/83/c7nmps.jpg" className="sliderimg"/>
                        <img src="https://www.listofdownload.com/wp-content/uploads/2018/10/Aquaman-2018-DC-Comics-Movie-Wallpaper-1920x1080.jpg" className="sliderimg"/>
                        <img src="https://wallpapercave.com/wp/uw0gHLX.jpg" className="sliderimg"/>
                        <img src="https://www.pixel4k.com/wp-content/uploads/2019/10/joker-happy-dancing_1572368502.jpg" className="sliderimg"/>
                        <img src="https://www.wallmesh.com/wp-content/uploads/2017/11/rampage-2018-movie-hd-wallpaper-1920x1080.jpg" className="sliderimg"/>
                        <img src="https://images.hdqwalls.com/wallpapers/rio-2-movie-hd.jpg" className="sliderimg"/>
                    </AliceCarousel>
                </div>
                <h3 class="htag">Recommended Movies</h3>
                <div class="outer">
                    { 
                        this.state.recommandationData.map((data)=> <div class="zoom">
                            <img src={data.imageLink} id={data.id} style={{ width:'200px', height:'200px'}} onClick={this.moveToDetails} ></img>
                        </div>)
                    }   
                </div>
                <h3 class="htag">New Movies</h3>
                <div class="outer">
                    { 
                        this.state.newMovieData.map((data)=> <div class="zoom">
                            <img src={data.imageLink} id={data.id} style={{ width:'200px', height:'200px'}} onClick={this.moveToDetails} ></img>
                        </div>)
                    }  
                </div>
                <h3 class="htag">Last Seen</h3>
                <div class="outer">
                    { 
                        this.state.lastSeenMovie.map((data)=> <div class="zoom">
                            <img src={data.imageLink} id={data.id} style={{ width:'200px', height:'200px'}} onClick={this.moveToDetails} ></img>
                        </div>)
                    }
                </div>    
            </div>
        )
    }
}

export default Home;