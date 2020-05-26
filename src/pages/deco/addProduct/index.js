import React, { Component } from 'react';
import { uniqueId } from 'lodash';
import filesize from 'filesize'

import api from '../../../services/api'
import HeaderDeco from '../Headerdeco'

import Upload from '../components/Upload'
import {FileList} from '../components/FileList/index.js'

import "./styles.css";

export default class addProduct extends Component {

    state = {

        name: "",
        category : '',
        estrutura: "",
        tampo: "",
        largura: 0,
        profundidade: 0,
        altura: 0,
        preco: 0,
        desc: "",

        categories: [],
        uploadedFiles: [],
        filesId: []
    }

    componentDidMount(){
        this.loadCategories()
    }

    loadCategories = async() => {
        const response = await api.get('/indexcategory');
        this.setState({categories:response.data})
    }

    handleImageError = () => {
        var error = false;
        var uploadedError = false
        this.state.uploadedFiles(file => {
            if(file.error === true){
                return error = true;
            }    
            if(file.uploaded === false){
                return uploadedError = true
            }    
        })
    }

    handleSubmit = async(e) => {

        e.preventDefault();
        if(this.state.uploadedFiles.length < 2){
            alert("minimo de 2 imagens")
            return;
        }
        
        if(this.state.category < 1){
            alert('categoria obrigatória');
            return;
        }
        try{
            
            await this.processUpload();

            const data = {
                name: this.state.name,
                category: this.state.category, 
                estrutura: this.state.estrutura, 
                tampo: this.state.tampo,
                largura: this.state.largura,
                profundidade: this.state.profundidade,
                altura: this.state.altura,
                preco: this.state.preco,
                desc: this.state.desc, 
                imageId: this.state.filesId
            }
            const response = await api.post('/newproduct', data)
            alert('itens enviados')
            this.setState({name:"", category:"", estrutura:"", tampo:"", largura: 0, profundidade: 0, altura:0, preco: 0            
            ,filesId:[], uploadedFiles:[]});

        }catch(e){
            console.info(e)
            alert('algo deu errado')
        }
    }

    handleUpload = files => {
        const uploadedFiles = files.map(file => ({
            file,
            id: uniqueId(),
            name: file.name,
            readableSize: filesize(file.size),
            preview: URL.createObjectURL(file),
            progress: 0,
            uploaded: false,
            error: false,
            url: null,
        }))

        this.setState({
            uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
        });
    }

    updateFile = (id, data) => {
        this.setState({uploadedFiles: this.state.uploadedFiles.map(uploadedFile => {
            return id === uploadedFile.id ? { ...uploadedFile, ...data} : uploadedFile;
        })})
    }

    processUpload = async() => {
        for(const uploadedFile of this.state.uploadedFiles){
            const data = new FormData();
            data.append("file", uploadedFile.file, uploadedFile.name);
            await api.post('/createimages', data, {
                onUploadProgress: e => {
                    const progress = parseInt(Math.round((e.loaded * 100) / e.total));

                    this.updateFile(uploadedFile.id, {
                        progress,
                    })
                }
            }).then((response)=>{
                this.state.filesId.push(response.data.image._id)
                this.updateFile(uploadedFile.id, {
                    uploaded: true,
                    id: response.data.image._id,
                    url: response.data.image.url
                })
            }).catch(()=>{
                this.updateFile(uploadedFile.id, {
                    error: true
                })
            });
        }
    }

    handleDelete = (id) => {
        this.setState({
            uploadedFiles: this.state.uploadedFiles.filter(file => file.id != id)
        })
    }

    render(){
        const {categories, uploadedFiles} = this.state
        return(
            <div className='addproduct-container'>
               <HeaderDeco></HeaderDeco> 
               <main>
                   <h1>Adicionar Produto</h1>
                   <form onSubmit={this.handleSubmit} className='form-addproduct'>
                        <label>nome<input placeholder='nome do produto' value={this.state.name} onChange={e=>this.setState({name: e.target.value})} required></input></label>
                        <h2>Categoria</h2>
                        <div>
                            {categories.map(category =>{
                                return(
                                    <label>
                                        <input name='category' type='radio' value={category.name} 
                                            onChange={e=> this.setState({category: e.target.value})} 
                                            required>
                                        </input>
                                        {category.name}
                                    </label>
                                )
                            })
                            }
                        </div>
                        <label>estrutura <input placeholder='estrutura' value={this.state.estrutura} onChange={e=>this.setState({estrutura: e.target.value})} required></input></label>
                        <label>tampo <input placeholder='tampo' value={this.state.tampo} onChange={e=>this.setState({tampo: e.target.value})} required></input></label>
                        <label>largura <input placeholder='largura' value={this.state.largura} onChange={e=>this.setState({largura: e.target.value})}></input></label>
                        <label>altura <input placeholder='altura' value={this.state.altura} onChange={e=>this.setState({altura: e.target.value})}></input></label>
                        <label>profundidade <input placeholder='altura' value={this.state.profundidade} onChange={e=>this.setState({profundidade: e.target.value})}></input></label>
                        <label>preço <input placeholder='preço' value={this.state.preco} onChange={e=>this.setState({preco: e.target.value})}></input></label>
                        <label id="desc-textarea">descrição <textarea placeholder='Descrição' value={this.state.desc} onChange={e=>this.setState({desc: e.target.value})}></textarea></label>
                        <Upload onUpload={this.handleUpload}></Upload>
                        { !!uploadedFiles.length && (<FileList files={uploadedFiles} onDelete={this.handleDelete}></FileList>)}
                        <button type="submit">Adicionar</button>                        
                   </form>
               </main>
            </div>
        )
    }
}