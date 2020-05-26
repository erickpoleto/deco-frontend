import React, { Component } from 'react';

import Carousel from 'react-bootstrap/Carousel'
import api from "../../services/api";
import serrimg from '../../imgs/shutterstock-539932924.png'

import Products from '../../components/Products/index'
import Header from '../../components/Header/index'
import Categories from '../../components/Categories/index'
import './styles.css'

export default class Home extends Component {

    state = {
        imagesCarousel: [],
        products: [],
        categories: [],
        structCategories: []
        
    }

    componentDidMount() {
        this.loadProducts();
        this.loadImagesCarousel();
    }

    loadProducts = async () => {
        const response = await api.get(`/recentproducts`);
        const categories = await api.get('/indexcategory');
        this.setState({products: response.data, categories:categories.data})
    }

    loadImagesCarousel = async() => {
        this.state.imagesCarousel.push(serrimg);
    }

    handleCategory = async(e)=> {
        await this.props.history.push(`/moveis?category=${e.target.id}`)
    }

    render(){
        
        const {products,imagesCarousel, categories, productInfo, page} = this.state;
        return( 
            <div>
                <Header {...this.props}></Header>
                <div className="home-container">
                    
                    <header>
                        
                        <div className="carousel-div">
                            <Carousel>
                                {imagesCarousel.map(product=>{
                                    return(
                                        <Carousel.Item>
                                            <img
                                                className="d-block w-100"
                                                src={product}
                                                alt="First slide"
                                            />
                                            <Carousel.Caption>            
                                            </Carousel.Caption>
                                        </Carousel.Item>
                                    )
                                        })
                                    }
                            </Carousel>
                        </div>
                        <div className="divisa">

                        </div>
                        
                    </header>
                    <main>
                        <div className="main-div">
                            <Categories handleCategory={this.handleCategory} categories={categories}></Categories>
                            <div>
                                <h2 style={{marginLeft: "10px" }}>Produtos Adicionados Recentemente</h2>
                                <Products value={this.state.products}></Products>
                            </div>
                        </div>
                        
                    </main>  
                </div>
            </div>
        )
    }
}