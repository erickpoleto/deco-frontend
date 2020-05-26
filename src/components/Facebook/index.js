import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';

import './styles.css'

export default class Facebook extends Component {
    
    state = {
        isLoggedIn: false,
        userID: "",
        name: "",
        email: "",
        picture: ""
    }

    componentDidMount(){

    }

    componentClicked = () =>{
        console.info('clicked')
    }
    
    responseFacebook = response => {
        if(response.status == 'unknown'){
            return;
        }else{
            this.setState({
                isLoggedIn: true,
                userID: response.userID,
                name: response.name,
                email: response.email,
                picture: response.picture.data.url
            })
        }
    }

    
    handleChange = () => {
        this.props.updateUserState({
            email: this.state.email, 
            name: this.state.name,
            picture: this.state.picture
        });
    }
    
    
    render(){
        let fbContent;
        if(this.state.isLoggedIn) {
            fbContent = (
                <div>    
                    <img src={this.state.picture}></img>
                    <strong style={{marginLeft: '10px'}}>olá, {this.state.name}</strong>  
                </div>
            )
        }else{
            fbContent = (
            <div>
                <FacebookLogin
                appId="351539589159014"
                autoLoad="true"
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook} />
            </div>)
        }

        return(
            <div onLoad={this.handleChange} className='facebook-container'>
                {fbContent}
            </div>
        )
    }
}