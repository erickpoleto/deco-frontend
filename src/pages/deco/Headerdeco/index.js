import React, { Component } from 'react'


import image from '../../../imgs/pp.png'
import {Link} from 'react-router-dom'

import './styles.css'

export default class HeaderDeco extends Component {

    render(){
        return(
            <div className="headerdeco-container">
                <header>
                    <div>
                        <span><img src={image} style={{width:"150px", height:"150px"}}></img></span>
                        <span><h1>D<b>E</b>C<b>O</b></h1>
                        <h2>Estruturas Metálicas</h2></span>
                    </div>
                    <ul>
                        <li><Link style={{color:"white", textDecoration:'none'}} to="/decohome">products</Link></li>
                        <li><Link style={{color:"white", textDecoration:'none'}} to="/addProduct">adicionar produtos</Link></li>
                        <li><Link style={{color:"white", textDecoration:'none'}} to="/addservice">adicionar servicos</Link></li>
                        <li><button id="btn-logout" onClick={this.handleLogout}>sair</button></li>
                    </ul>
                </header>
            </div>
        )
    }
}