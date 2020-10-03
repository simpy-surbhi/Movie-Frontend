import React, { Component } from 'react';
import '../Css/SearchMovie.css'
import { searchMovie } from '../api/apiService'
import AliceCarousel from 'react-alice-carousel';
class SearchMovie extends Component {

    name = ""
    constructor(props) {
        super(props);
        this.state = {
            childComponent:[]
        }
        this.name = props.match.params.name
        this.moveToDetails = this.moveToDetails.bind(this)
    }

    componentDidMount() {
        this.getSearchData(this.name)
    }

    getSearchData(name){
        searchMovie(name).then((data)=>{
            if (data.status == 200) {
                return data.json()
            } else if (data.status == 401) {
                this.returnHome()
            } else {
                this.returnHome()
            }
        }).then((data)=>{
            console.log(data)
            this.setState({
                childComponent: data
            })
        }).catch(err => {
            this.returnHome()
        })
    }

    returnHome(){
        this.props.history.push('/')
    }

    moveToDetails(event){
        const id = event.target.id;
        this.props.history.push(`/details/${id}`)        
    }

    getrDivList() {
        return this.state.childComponent.map((data) => 
            <div><img key={data.id} id={data.id} src={data.imageLink} onClick={this.moveToDetails} style={{width:'300px',height:'300px'}}/></div>
        )
    }
    
    render() {
        return (
            <div class="mainbody">
                <div>
                    <label class="labelclassSearch">Movies List</label>
                </div>
                <div class="outer1">
                    { this.getrDivList() }
                </div>

            </div>
        )
    }
}

export default SearchMovie;