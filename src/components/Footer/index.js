import React, { Component } from 'react';

import {FaFacebook, FaInstagram} from 'react-icons/fa'
import './styles.css';

import api from '../../services/api'
import {isAuthenticated} from '../../services/auth'
import {Link} from 'react-router-dom'

export default class Footer extends Component {
    
    state = {
        route: '/logindeco',
        categories: []
    }

    componentDidMount(){
        if(isAuthenticated()){
            this.setState({route: '/decohome'})
        }
        this.loadCategories();
    }

    loadCategories= async() => {
        const response = await api.get('/indexcategory')
        this.setState({categories:response.data})
    }

    render(){
        const {categories} = this.state;
        return (
            <div className='footer-container'>
                <footer>
                    <section className="access-section">
                        <div>
                            <strong>Categorias móveis</strong>
                            {categories.map(category=>{
                                return(
                                    <Link to="as">{category.name}</Link>
                                )
                            })}
                        </div>
                        <div>
                            <strong>Redes Sociais</strong>
                            <a href="%"><FaFacebook size={20} color="#1A65C7"/></a>
                            <a href="%"><FaInstagram size={20} color="#DE7FA6"/></a>
                        </div>
                        <div>
                            <strong>Portal</strong>
                            <Link to={this.state.route}>Deco</Link>
                        </div>
                    </section>
                    <section className="foot-section">
                        <p>© Copyright</p>
                    </section>
                </footer>
            </div>
        )
    }
    
}