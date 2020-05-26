import React, { Component } from 'react'

import {Link} from 'react-router-dom'

import api from '../../services/api'


import Header from '../../components/Header/index'
import './styles.css'

export default class Cart extends Component {
    
    state = {
        cartItems: [],
        products: [],
        quantidade: [],
        total: 0,
        name: "",        
        email: "",
        cpf: "",
        cep: "",
        ddd: "",
        number: "",
        msg: ""
    }
    async componentDidMount(){
        await this.loadProducts();
    }


    loadProducts = async() => {
        await this.setState({cartItems: JSON.parse(localStorage.getItem("@cart-item") || "[]")})

        for(const item of this.state.cartItems){
            const response = await api.get(`/product/${item}`)
            this.setState({products: [...this.state.products, response.data], 
                quantidade: [...this.state.quantidade, {id:response.data._id, value:1, 
                    subtotal:response.data.preco}],
            })
        }
    }

    handleDelete = async(id) => {
        await this.setState({cartItems: this.state.cartItems.filter(cart => cart != id),
            products: this.state.products.filter(product => product._id != id),
            quantidade: this.state.quantidade.filter(quant => quant.id != id)
        })
        localStorage.setItem("@cart-item", JSON.stringify(this.state.cartItems))
    }

    handleSend = async(e) => {
        e.preventDefault()
        if(/\d/.test(this.state.name)){
            const nome = document.querySelector(".nomespan")
            nome.classList.add("ativaspan")
            return;
        }
        const data = {
            type: "consult",
            name: this.state.name,
            email: this.state.email,
            cpf: this.state.cpf,
            cep: this.state.cep,
            ddd: this.state.ddd,
            number: this.state.number,
            msg: this.state.msg,
            products: this.state.products.map((product, index)=>{
                return{
                    product: product,
                    quant: this.state.quantidade[index].value
                }
            })
        }

        try{
            await api.post("/mails", data).then(response=>{
                alert("email enviado! entraremos em contato em breve")
                localStorage.removeItem("@cart-item")
                this.props.history.push("/")
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

    
    handleModal = (e) => {
        const modal = document.querySelector(".modal");
        if(e.target.id === "openmodal"){
            modal.classList.add("modal--open")
            return;
        }
        document.activeElement.blur();
        modal.classList.remove("modal--open")
        
    }

    incrementavalor = (index) => {
        const quantidade = this.state.quantidade;
        quantidade[index].value = quantidade[index].value + 1;
        quantidade[index].subtotal = this.state.products[index].preco * quantidade[index].value;
        this.setState({quantidade: quantidade})
    }
    decrementavalor = (index) => {
        const quantidade = this.state.quantidade;
        if(quantidade[index].value > 1){
            quantidade[index].value = quantidade[index].value - 1;
            quantidade[index].subtotal = this.state.products[index].preco * quantidade[index].value;
            this.setState({quantidade: quantidade})
            return;
        }
        return;
    }

    render(){

        const {products, cartItems, quantidade, totalValue} = this.state

        return(
            
            <div>
                <Header value={cartItems} {...this.props}></Header>
                <div className="cart-container"> 
                    
                    {cartItems.length < 1 && (
                        <main className="empitycart-main">
                            <h2>O carrinho está vazio</h2>
                            <Link to="/">voltar para pagina de produtos</Link>
                        </main>
                    )}

                    {cartItems.length > 0 && (
                        <main>
                            <h1>Carrinho</h1>
                            
                            <table>
                                <thead>
                                    <th>Produto</th>
                                    <th>Preço unitário</th>
                                    <th>Quantidade</th>
                                    <th>Subtotal</th>
                                    <th>Excluir</th>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => {
                                        return(
                                            <tr>
                                            <td className="product-td">
                                                <div>
                                                    <img src={product.imageId[0].url} style={{width:"50px", height:"50px"}}></img>
                                                    <ul>
                                                        <li>{product.name}</li> 
                                                    </ul>
                                                </div>
                                            </td>
                                            <td>R$ {product.preco}</td>
                                            <td className="quant-td">
                                                <div>
                                                    <button onClick={e=> this.decrementavalor(index)}>-</button>
                                                        <input value={this.state.quantidade[index].value}></input>
                                                    <button onClick={e=> this.incrementavalor(index)}>+</button>
                                                </div>
                                            </td>
                                            <td>R$ {this.state.quantidade[index].subtotal}</td>
                                            <td className="tresh-td">
                                                <button type="button" onClick={e => this.handleDelete(product._id)}></button>
                                            </td>
                                        </tr>
                                        )
                                    })
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td  colSpan="5">
                                            <div>
                                            <p>total: R$ <b>{this.state.quantidade.reduce((total, n) =>{
                                                                    return total + n.subtotal
                                                                }, 0.0)}</b></p>
                                                <p>ou em até <b>3x</b> de <b>R${this.state.quantidade.reduce((total, n) =>{
                                                                   return Math.round((total + n.subtotal) / 3)
                                                                }, 0.0)}</b> sem juros</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            <section className="finalizarcompra-section">
                                <div className="finalizarcompra-div">
                                    <strong>comprasegura</strong>
                                    <div>
                                        <Link to="/">ver outros produtos</Link>
                                        <button id="openmodal" onClick={this.handleModal}>Solicitar orçamento</button>
                                    </div>
                                </div>
                                <div className="modal">
                                    <div className="modalcontent-div">
                                        <div className="modaltittle-div">
                                            <h3>Solicitar orçamento</h3>
                                            <button className="closemodal" onClick={this.handleModal}>x</button>
                                        </div>
                                        <div className="modalmain-div">
                                            <form onSubmit={this.handleSend} id="modal-form" className="modal-form">
                                                <span className="nomespan"><p>seu nome não pode possuir numeros</p></span>
                                                <label>Nome <input onChange={e=>this.setState({name: e.target.value})} placeholder="seu nome" required></input></label>
                                                <label>E-mail <input onChange={e=>this.setState({email: e.target.value})} placeholder="seu Email" required></input></label>
                                                <label>CPF <input type="number" onChange={e=>this.setState({cpf: e.target.value})} placeholder="seu CPF" required></input></label>
                                                <label>celular/telefone<input type="number" onChange={e=>this.setState({ddd: e.target.value})} id="ddd" placeholder="ddd" required></input>
                                                                <input type="number" onChange={e=>this.setState({number: e.target.value})} placeholder="xxxxxxxxx" required></input></label>
                                                <label>CEP <input type="number" onChange={e=>this.setState({cep: e.target.value})} placeholder="seu cep" required></input></label>
                                                <label>Mensagem <textarea onChange={e=>this.setState({msg: e.target.value})} placeholder="Mensagem(opcionial)"></textarea></label>
                                            </form>
                                            <table>
                                                <thead>
                                                    <th>produto</th>
                                                    <th>Qtde</th>
                                                    <th>Preço</th>
                                                </thead>
                                                <tbody>
                                                    {products.map((product, index) =>{
                                                        return(
                                                            <tr>
                                                                <td className="product-td">
                                                                <div>
                                                                    <img src={product.imageId[0].url} style={{width:"50px", height:"50px"}}></img>
                                                                    <ul>
                                                                        <li>{product.name}</li> 
                                                                    </ul>
                                                                </div>
                                                                </td>
                                                                <td>{this.state.quantidade[index].value}</td>
                                                                <td>R$ {this.state.quantidade[index].subtotal}</td>
                                                            </tr>
                                                        )
                                                    })
                                                    }
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan="3">total: R${this.state.quantidade.reduce((total, n) =>{
                                                                    return total + n.subtotal
                                                                }, 0.0)}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                        <div className="modalfoot-div">
                                            <button className="closemodal" onClick={this.handleModal}>fechar</button>
                                            <button type="submit" form="modal-form" onClick={e=>""}>Enviar</button>
                                        </div>
                                    </div>
                                    <div onClick={this.handleModal} className="modaloverlay-div">
                                    </div>
                                </div>
                            </section>
                        </main>
                    )}
                </div>
            </div>
        )
    }
}