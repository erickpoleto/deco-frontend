import React, { Component } from 'react';
import { uniqueId } from 'lodash';
import filesize from 'filesize'

import api from '../../../services/api'
import HeaderDeco from '../Headerdeco'

import Upload from '../components/Upload'
import {FileList} from '../components/FileList/index.js'

import "./styles.css";

export default class addservice extends Component {

    state ={
        serviceName: "",
        serviceCategory : '',
        serviceDesc: "",
        serviceTec: "",

        structCategories: [],
        
        uploadedFiles: [],
        filesId: []
    }

    componentDidMount(){
        this.loadCategories()
    }

    loadCategories = async() => {
        const response = await api.get('/indexstructcategory');
        this.setState({structCategories:response.data})
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
        
        if(this.state.serviceDesc.length < 10 || this.state.serviceTec.length < 10){
            alert("minimo de 20 caracteres por descrição")
            return;
        }
        if(this.state.serviceCategory < 1){
            alert('categoria obrigatória');
            return;
        }
        try{
            
            await this.processUpload();

            const data = {
                name: this.state.serviceName,
                category: this.state.serviceCategory,
                desc: this.state.serviceDesc,
                tec: this.state.serviceTec,
                imageId: this.state.filesId
            }
            const response = await api.post('/newservice', data)
            alert('itens enviados')
            this.setState({serviceName:"", serviceCategory:"", serviceDesc:"", serviceTec:"", filesId:[], uploadedFiles:[]});

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
        const {structCategories, uploadedFiles} = this.state
        return(
            <div className='addservice-container'>
               <HeaderDeco></HeaderDeco> 
               <main>
                   <h1>Adicionar serviço</h1>
                   <form onSubmit={this.handleSubmit} className='form-addservice'>
                        <input placeholder='nome do service' value={this.state.serviceName} onChange={e=>this.setState({serviceName: e.target.value})} required></input>
                        <h2>Categoria</h2>
                        <div>
                            {structCategories.map(category =>{
                                return(
                                    <label>
                                        <input name='category' type='radio' value={category.name} 
                                            onChange={e=> this.setState({serviceCategory: e.target.value})} 
                                            required>
                                        </input>
                                        {category.name}
                                    </label>
                                )
                            })
                            }
                        </div>
                        <textarea placeholder='Descrição' value={this.state.serviceDesc} onChange={e=>this.setState({serviceDesc: e.target.value})}></textarea>
                        <textarea placeholder='Descrição técnica' value={this.state.serviceTec} onChange={e=>this.setState({serviceTec: e.target.value})}></textarea>
                        <Upload onUpload={this.handleUpload}></Upload>
                        { !!uploadedFiles.length && (<FileList files={uploadedFiles} onDelete={this.handleDelete}></FileList>)}
                        <button type="submit">Adicionar</button>                        
                   </form>
               </main>
            </div>
        )
    }
}