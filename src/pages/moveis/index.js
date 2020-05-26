import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import api from '../../services/api'
import Header from '../../components/Header'
import Products from '../../components/Products'
import Categories from '../../components/Categories'

import './styles.css'
import { FaChevronDown,FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default class Moveis extends Component{

    state = {
        categories: [],
        structCategories: [],
        products: [],
        productsInfo: {},
        search: this.props.location.search,
        sortOrd: 1,
        page: 1
    }

    componentDidMount(){
        this.loadCategories()
        this.loadProducts()
    }

    async componentDidUpdate(prevProps, prevState){
        if(prevProps.location.search != this.props.location.search){
            await this.setState({search: this.props.location.search})
            this.loadProducts()
        }
        if(prevState.sortOrd != this.state.sortOrd){
            await this.loadProducts()
        }
    }

    loadProducts = async(page=1) => {
        const data = {
            sortOrd : this.state.sortOrd
        }
        const response = await api.get(`/products?page=${page}&${this.state.search.replace("?", "")}`, data)
        const {docs, ...productsInfo} = response.data
        this.setState({products: docs, productsInfo})
        
    }

    loadCategories = async() => {
        const response = await api.get("/indexcategory");
        this.setState({categories: response.data})
    }

    handleCategory = async(e)=> {
        await this.props.history.push(`/moveis?category=${e.target.id}`)
    }

    prevPage = () => {
        const { page, productsInfo} = this.state;
        if(productsInfo.pages === 1 || productsInfo.page === "1"){
            return;
        }
        const pageNumber = page - 1
        this.loadComments(pageNumber)
    }
    nextPage = () => {
        const { page, productsInfo} = this.state;
        if (page === productsInfo.pages) {
            return;
        }
        const pageNumber = page + 1
        this.loadComments(pageNumber);
    }


    render(){
        
        const {categories, products, productsInfo, search} = this.state

        return(
            <div>
                <Header {...this.props}></Header>
                <div className="moveis-container">
                    <main>
                        <div className="pagemap-div">
                            <Link to="/"></Link>
                            <Link style={{marginLeft:"5px"}} to="/"> <b>></b> {search.replace(/[?](search|category)[=]/, "")}</Link>
                        </div>
                        <div className="main-div">
                            <Categories handleCategory={this.handleCategory} categories={categories}>
                                
                            </Categories>
                            <div className="products-div">
                                <div className="orderby-div">
                                    <button>Escolher ordem <FaChevronDown size={14}/></button>
                                    <div className="orderby-drop-div">
                                        <button onClick={e=>this.setState({sortOrd: 1})} className="sortbutton">$ Menor preço</button>
                                        <button onClick={e=>{this.setState({sortOrd: -1})}} className="sortbutton">$ Maior preço</button>
                                    </div>
                                </div>
                                
                                <h2>{search.replace(/[?](search|category)[=]/, "")}</h2>
                                <Products value={products} {...this.props}></Products>
                                
                                <div className="actions">
                                    <button disabled={this.state.page === 1} onClick={this.prevPage}><FaChevronLeft size={30}></FaChevronLeft></button>
                                    <p>Página {this.state.page} de {productsInfo.pages}</p>    
                                    <button disabled={this.state.page === productsInfo.pages} onClick={this.nextPage}><FaChevronRight size={30}></FaChevronRight></button> 
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }
}