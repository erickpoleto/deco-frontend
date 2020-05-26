import React, { Component } from 'react';
import {FaEnvelope, FaChevronDown, FaWhatsapp} from 'react-icons/fa'
import './styles.css';

import {Link, useHistory} from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar'

import api from '../../services/api'

import pp from '../../imgs/Ativo3.png'
import projectImg from '../../imgs/project-management.png'
import shopImg from '../../imgs/commerce-and-shopping.png'

export default class Header extends Component {
    
    state = {
        cartItems: JSON.parse(localStorage.getItem("@cart-item") || "[]"),
        categories: [],
        search: ""
    }

    componentDidMount(){
        this.loadCategories()
    }

    componentDidUpdate(prevProps){
        if(prevProps.value != this.props.value){
            this.setState({cartItems: this.props.value})
        }
    }

    loadCategories = async() => {
        const response = await api.get("/indexcategory")
        this.setState({categories: response.data})
    }

    handleSubmit = async(e)=> {
        e.preventDefault();
        this.props.history.push(`/moveis?search=${this.state.search}`)
    }

    handleModalHeader = (e)=> {
        const modal = document.querySelector(".modalheader");
        if(e.target.id === "openmodal-header"){
            modal.classList.add("modal--open")
            return;
        }
        document.activeElement.blur();
        modal.classList.remove("modal--open")
    }
    handleSendEmail = async(e) => {
        e.preventDefault()
        if(/\d/.test(this.state.name)){
            const nome = document.querySelector(".spannome")
            nome.classList.add("ativaspanome")
            return;
        }
        const data = {
            type: "callcenter",
            name: this.state.name,
            email: this.state.email,
            ddd: this.state.ddd,
            number: this.state.number,
            msg: this.state.msg
        }

        try{
            await api.post("/mails", data).then(response=>{
                alert("email enviado! entraremos em contato em breve")
            }
            ).catch(err => {
                console.info(err)
                alert("algo deu errado")
            })
        }catch(e){
            console.info(e);
            alert("algo deu errado");
        }
    }

    handleOpenSearch = (e) => {
        const searchForm = document.querySelector(".search-form");
        searchForm.classList.toggle("search-form--active");
    }

    handleOpenMenuNav = (e) => {
        const menuNav = document.querySelector(".menu-nav");
        menuNav.classList.toggle("menu-nav--active");
    }
    handleOpenDrop = (e) => {
        const dorpDown = document.querySelector(".dropdowncontent-div");
        dorpDown.classList.toggle("dropdowncontent-div--active");
    }

    render(){
        const {cartItems, categories} = this.state
        return (
            <div>
                <div className='header-container'>
                    <header>
                            <div>
                                <nav>
                                    <Link><img src={projectImg} style={{width:"30px", height: "30px"}}></img></Link>
                                    <Link style={{color:"white"}}>envie sua idéia, nos fazemos!</Link>
                                </nav>
                                <nav className="contact-nav">
                                    <button id="openmodal-header" onClick={this.handleModalHeader}>Fale Conosco!</button>
                                    <a href='#'>telefone: (51)55555555</a>
                                    <a href='#'>whatsapp: (51)999811810</a>
                                </nav>
                            </div>
                        
                    </header>
                </div>
                <section className="menu-section">
                    <div className="header-menu-div">
                        <div className="menu-nav">
                            <span style={{zIndex:"20"}}>
                                <Link id="home" to="/">Página principal</Link>
                            </span>
                            <div className="ferromadeiradrop-div dropdown-div">
                                <button onClick={this.handleOpenDrop}>Estruturas Ferro</button>
                                <div className="dropdowncontent-div">
                                    <Link to="/moveis">todos</Link>
                                    {categories.map(category => {
                                        return(
                                            <Link to={`/moveis?category=${category.name}`}>{category.name}</Link>
                                        )
                                    })}
                                </div>
                            </div>
                            
                            <div className="overlay-menu"></div>
                        </div>
                        <div className="menusearch-div">
                            <button onClick={this.handleOpenMenuNav} className="svg-button">
                                <svg viewBox="0 0 100 80" width="30" height="40">
                                    <rect classList="bar1" width="100" height="10"></rect>
                                    <rect classList="bar2" y="30" width="100" height="10"></rect>
                                    <rect classList="bar3" y="60" width="100" height="10"></rect>
                                </svg>
                            </button>
                            <div>
                                <span><Link to="/"><img src={pp}></img></Link></span>
                            </div>
                            <form onSubmit={this.handleSubmit} className="search-form">
                                <input onChange={e=> this.setState({search: e.target.value})} placeholder="o que você procura?"></input>
                                <button className="searchicon" type="submit"></button>
                            </form>
                            <button onClick={this.handleOpenSearch} type="button" id="searchicon-id" className="searchicon iconsearch"></button>
                            <div className="cart-div">
                                <Link to="/cart"><img src={shopImg}></img></Link>
                                <Link href="/cart"><strong>carrinho ({cartItems.length})</strong></Link>
                                
                            </div>
                        </div>
                    </div>
                </section>
                <div className="modalheader">
                    <div className="modalheadercontent-div">
                        <div className="modalheadertittle-div">
                            <h3>Fale Conosco</h3>
                            <button onClick={this.handleModalHeader}>x</button>
                        </div>
                        <div className="modalheadermain-div">
                            <form onSubmit={this.handleSendEmail} id="modalheader-form" className="modalheader-form">
                                <span className="spannome"><p>apenas letras permitidas para o campo nome</p></span>
                                <label>Nome <input onChange={e=>this.setState({name: e.target.value})} placeholder="Nome" required></input></label>
                                <label>E-mail <input onChange={e=>this.setState({email: e.target.value})} placeholder="Email" required></input></label>
                                <label>Telefone <input type="number" onChange={e=>this.setState({ddd: e.target.value})} id="ddd" placeholder="ddd" required></input><input placeholder="xxxxxxxxx" required></input></label>
                                <label>Mensagem <textarea placeholder="Mensagem(opcionial)"></textarea></label>
                            </form>
                            <div>
                                <ul>
                                    <li>
                                        <strong>CNPJ</strong>
                                        <p>454545.85858</p>
                                    </li>
                                    <li>
                                        <strong>telefone</strong>
                                        <p>(51)55555555555</p>
                                    </li>
                                    <li>
                                        <strong>whatsapp</strong>
                                        <p>(51)44554455</p>
                                    </li>
                                    <li>
                                        <strong>Email</strong>
                                        <p>contato@taltal.com.br</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="modalheaderfoot-div">
                            <button className="closemodal" onClick={this.handleModalHeader}>fechar</button>
                            <button type="submit" form="modalheader-form">Enviar</button>
                        </div>
                    </div>
                    <div onClick={this.handleModalHeader} className="modalheaderoverlay-div">
                    </div>
                </div>
            </div>
        )
    }
    
}