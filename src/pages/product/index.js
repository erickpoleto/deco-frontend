import React, { Component } from 'react';

import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import ImageGallery from 'react-image-gallery';
import shopImg from '../../imgs/commerce-and-shopping.png'

import Facebook from '../../components/Facebook/index.js'

import api from '../../services/api'

import {Link} from 'react-router-dom'


import Header from '../../components/Header/index'
import './styles.css'

export default class Product extends Component {

    constructor(props){
        super(props);
    }

    state={
        product: {},
        image: [],
        comments: [],
        infoComments: {},
        comment: "",
        infoUser: {},
        page: 1,
        cartItems: JSON.parse(localStorage.getItem("@cart-item") || "[]")
    }

    componentDidMount(){
        this.loadProduct();
        this.loadComments();
    }

    loadProduct = async() => {
        const { id } = this.props.match.params;
        const response = await api.get(`/product/${id}`)
        this.setState({product:response.data, 
            image: response.data.imageId.map(item=>{return {original: item.url, thumbnail: item.url}}),
        })
    }

    loadComments = async(pageNumber=1) => {
        const { id } = this.props.match.params;
        const comments = await api.get(`/indexcomment/${id}?page=${pageNumber}`);
        const {docs, ...infoComments} = comments.data
        this.setState({comments: docs, infoComments, page:pageNumber});
    }

    prevPage = () => {
        const { page, infoComments} = this.state;
        if(infoComments.pages === 1 || infoComments.page === "1"){
            return;
        }
        const pageNumber = page - 1
        this.loadComments(pageNumber)
    }
    nextPage = () => {
        const { page, infoComments} = this.state;
        if (page === infoComments.pages) {
            return;
        }
        const pageNumber = page + 1
        this.loadComments(pageNumber);
    }
    updateUserState = (item) => {
        this.setState({infoUser:item})
    }

    submitCommentHandler = async(e) => {
        e.preventDefault();
        if(this.state.infoUser.email === undefined){
            alert("você precisa estar logado com facebook para comentar");
            return;
        }
        if(this.state.comment.length < 10){
            document.querySelector('.comment-empity-alert')
            .classList.add('comment-empity-alert--active')
            return;
        }
        const data = {
            username: this.state.infoUser.name,
            email: this.state.infoUser.email,
            comment: this.state.comment,
            picture: this.state.infoUser.picture,
            productId: this.state.product._id
        }
        try{
            const response = await api.post('/newcomment', data);
            alert("comentario enviado")
            this.setState({comment: ""})
            this.loadComments();
        }catch(e){
            if(e.response.status === 405){
                alert('você só pode comentar 10 vezes neste produto')
            }
            else{
                console.info('algo deu errado')
            }
        }
    }

    removeComment = async(e) => {
        try{
            const reponse = await api.delete(`/deletecomment/${e.target.id}`)
            alert('comentario removido')
            this.loadComments();
        }catch(e){
            console.info(e)
        }
    }

    handleAddCart = () => {
        if(this.state.cartItems.includes(this.state.product._id)){
            return this.props.history.push("/cart")
        }
        this.state.cartItems.push(this.state.product._id)
        localStorage.setItem("@cart-item", JSON.stringify(this.state.cartItems))
        this.props.history.push("/cart")
    }

    render(){
        const {product, image, comments, cartItems, infoComments} = this.state;
        return(
            <div>
                
                <Header {...this.props}></Header>
                <div className='product-container'>
                    
                    <section className="productinfo-section">
                        <div className="image-div">
                            <ImageGallery lazyLoad={true} showFullscreenButton={false} items={image}/>
                        </div>
                        <div className="consult-info">
                            <div className="pagemap-div">
                                <Link to="/"></Link>
                                <Link to={`/moveis?category=${product.category}`}>{product.category}</Link>
                            </div>
                            <h2>{product.name}</h2>
                            <div className="price-div">
                                <span>
                                    <strong>R$ {product.preco}</strong>
                                    <p>até <b>3x</b> de <b>{Math.round(product.preco / 3)}</b></p>
                                </span>
                            </div>

                            {cartItems.includes(product._id) && (
                                <button className="btn-sol-consult" onClick={this.handleAddCart} value="Solicitar">
                                    <img src={shopImg} style={{width: "28px", height: "28px", marginRight:"6px"}}></img> 
                                    Produto no carrinho!
                                </button>
                            )}
                            {!cartItems.includes(product._id) && (
                                <button className="btn-sol-consult" onClick={this.handleAddCart} value="Solicitar">
                                    <img src={shopImg} style={{width: "28px", height: "28px", marginRight:"6px"}}></img> 
                                    Solicitar Consultoria
                                </button>
                            )}
                            
                        </div>
                    </section>

                    <section className="desc-section">
                        <div className="desc-div">
                            <h5>{product.name} <b>(Solicite uma consultoria para mais informações!)</b></h5>
                            <p>Largura: <strong>{product.largura}</strong></p>
                            <p>Altura: <strong>{product.altura}</strong></p>
                            <p>{product.desc}</p>
                        </div>
                    </section>

                    <section className="comments-section">
                        <div className="leavecomment-div">
                            <Facebook updateUserState={this.updateUserState}></Facebook>
                            <h4>Deixe um comentário</h4>
                            <span className="comment-empity-alert"><p>Para Enviar, a caixa precisa estar preenchida com pelo menos 10 caracteres</p></span>
                            <form onSubmit={this.submitCommentHandler} className="leavecomment-form">
                                <textarea value={this.state.comment} onChange={e => this.setState({comment:e.target.value})} className='leavecomment-textarea'></textarea>
                                <button type='submit'>Enviar</button>
                            </form>
                        </div>
                        <div className="comments-div">
                            <strong>Comentários</strong>
                            <div className='commentsleaved-div'>
                                {comments.map(comment => {
                                    return(
                                        <div className="usercomment-div">
                                        <div>
                                            <h5><img src={comment.picture}></img> {comment.username}</h5>
                                            <p>{comment.comment}</p>
                                        </div>
                                        {this.state.infoUser.email === comment.email && ( 
                                            <div>
                                                <button onClick={this.removeComment} id={comment._id}  className="button-comment"></button>
                                            </div>    
                                            
                                        )}
                                        
                                        </div>
                                    )
                                })
                                }
                            </div>
                            <div className="actions">
                                <button disabled={this.state.page === 1} onClick={this.prevPage}><FaChevronLeft size={30}></FaChevronLeft></button>
                                <p>Página {this.state.page} de {infoComments.pages}</p>    
                                <button disabled={this.state.page === infoComments.pages} onClick={this.nextPage}><FaChevronRight size={30}></FaChevronRight></button>    
                            </div>
                        </div>
                    </section>
                </div>
                
            </div>
        )
    }
}