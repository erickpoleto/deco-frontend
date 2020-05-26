import React, { Component } from 'react'

import HeaderDeco from '../Headerdeco' 

import api from '../../../services/api'

import './styles.css'

export default class EditProduct extends Component {
    state = {
        name : "",
        category : "",
        categories: [],
        desc : "",
        tec : "",
        createdAt : "",
        images : []
    }

    componentDidMount(){
        this.loadProduct();
        this.loadCategories();
    }

    loadProduct = async() => {
        const {id} = this.props.match.params;
        const response = await api.get(`/product/${id}`);
        this.setState({name: response.data.name, category: response.data.category, 
                    desc: response.data.desc, tec: response.data.tec, createdAt: response.data.createAt, 
                    images: response.data.imageId
        })
    }

    loadCategories = async() => {
        const response = await api.get('/indexcategory');
        this.setState({categories:response.data})
    }

    render(){
        const {name, category, desc, tec} = this.state
        return(
            <div className="editproduct-container">
                <HeaderDeco></HeaderDeco>
                <main>
                    <h1>Editar Produto</h1>
                    <form>
                        <ul>
                        {this.state.images.map(image => {
                            return(
                                <li>
                                    <img src={image.url}></img>
                                    <button id="#excluir">excluir</button>
                                </li>
                            )
                        })}
                        </ul>
                        <label>nome<input placeholder="name" value={name}></input></label>
                        
                        <label>descrição<textarea placeholder="desc" value={desc}></textarea></label>   
                        <label>tecnico<textarea placeholder="tec" value={tec}></textarea></label>
                        <div>
                            <button type="submit">editar</button>
                            <button type="button">remover</button>
                        </div>
                    </form>
                </main>
            </div>
        )
    }
}