import React, {Component} from 'react'

import './styles.css'

export default class Orcamento extends Component{

    render(){
        return(
            <div className="orcamento-container">
                <div className="modalcontent-div">
                    <div className="modaltittle-div">
                        <h3>Solicitar orçamento</h3>
                        <button className="closemodal" onClick={this.handleModal}>x</button>
                    </div>
                    <div className="modalmain-div">
                        <form className="modal-form">
                            <label>Nome <input placeholder="Nome" required></input></label>
                            <label>E-mail <input placeholder="Email" required></input></label>
                            <label>CPF <input placeholder="CPF" required></input></label>
                            <label>Telefone <input id="ddd" placeholder="ddd" required></input><input placeholder="xxxxxxxxx" required></input></label>
                            <label>CEP <input placeholder="Cep(opcional)"></input></label>
                            <label>Mensagem <textarea placeholder="Mensagem(opcionial)"></textarea></label>
                        </form>
                        <table>
                            <thead>
                                <th>produto</th>
                                <th>Qtde</th>
                                <th>Preço</th>
                            </thead>
                            <tbody>
                                {products.map(product =>{
                                    return(
                                        <tr>
                                            <td className="product-td">
                                            <div>
                                                <img src={product.imageId[0].url} style={{width:"50px", height:"50px"}}></img>
                                                <ul>
                                                    <li>{product.name}</li> 
                                                    <li>estoque: 10</li> 
                                                </ul>
                                            </div>
                                            </td>
                                            <td>1</td>
                                            <td>R${this.state.quantidade.reduce((total, n) =>{
                                                return total + n.subtotal
                                            }, 0.0)}</td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3">total</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="modalfoot-div">
                        <button className="closemodal" onClick={this.handleModal}>fechar</button>
                        <button onClick={e=>""}>Enviar</button>
                    </div>
                </div>
                <div onClick={this.handleModal} className="modaloverlay-div">
                </div>
            </div>
        )
    }

}