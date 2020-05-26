import React, { Component } from 'react'

import {logout} from '../../../services/auth'
import api from '../../../services/api'

import {Link} from 'react-router-dom'

import HeaderDeco from '../Headerdeco/index'
import './styles.css'

export default class DecoHome extends Component {

    state = {
        products: [],
        productInfo: {}
    }

    componentDidMount() {
        this.loadProducts();
    }

    loadProducts = async() => {
        const response = await api.get('/products')
        const {docs, ...productInfo} = response.data
        this.setState({products: docs, productInfo})
    }

    handleLogout = async() => {
        const {history} = this.props
        logout()
        history.push('/') 
    }

    render(){
        const {products} = this.state
        return(
            <div className="decohome-container">
                <HeaderDeco></HeaderDeco>
                <main>
                    <input placeholder='procurar por produtos'></input>
                    <div className="products-div">
                        <ul>
                            <li id='li-btn-add'><button id='btn-add' onClick={e=>this.props.history.push('/addProduct')}></button></li>
                            {products.map(item => {
                                return(
                                    <li>
                                        <p>id: {item._id}</p>
                                        <p>{item.name}</p>
                                        <img src={item.imageId[0].url}></img>
                                        <button id='btn-editar' onClick={e=> this.props.history.push(`/editproduct/${item._id}`)}>
                                            editar
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </main>
            </div>
        )
    }
}