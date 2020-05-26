import React, { Component } from 'react'

import api from '../../../services/api'

import {login} from '../../../services/auth'

import './styles.css'

export default class LoginDeco extends Component{
    state = {
        email: '',
        password: ''
    }

    handleLogin = async(e) =>{
        e.preventDefault();
        const { history } = this.props;
        const data = {
            email: this.state.email,
            password: this.state.password
        }
        const response = await api.post('/session', data)
        .then((response)=>{
            login(response.data.token)
            alert('login efetuado')
            history.push('/DecoHome')
        }).catch((err)=>{
            alert(err)
        });
        
        
    }

    render(){
        return(
            <div className="logindeco-div">
                <section>
                    <div>
                        <h1>Login da empresa</h1>
                    </div>
                    <form onSubmit={this.handleLogin}>
                        <input onChange={e=>this.setState({email:e.target.value})} type='text' placeholder="email" required></input>
                        <input onChange={e=>this.setState({password:e.target.value})} type='password' placeholder="senha" required></input>
                        <button type='submit'>Login</button>
                    </form>
                </section>
            </div>
        )
    }
}