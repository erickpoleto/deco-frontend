import React, {Component} from 'react'

import Dropzone from 'react-dropzone'

import {DropContainer, UploadMessage} from './styles.js'

export default class Upload extends Component{
    
    dragMessage = (isDragActive, isDragReject) => {
        if(!isDragActive) {
            return <uploadMessage>adicione suas imagens aqui</uploadMessage>
        }
        if(isDragReject) {
            return <uploadMessage type="error">Arquivo não suportado</uploadMessage>
        }

        return <uploadMessage type="success">Solte os arquivos aqui</uploadMessage>
    }

    render(){
        const { onUpload } = this.props;
        return(
            <Dropzone accept="image/*" onDropAccepted={onUpload}>
                {   ({getRootProps, getInputProps, isDragActive, isDragReject}) => (
                        <DropContainer
                            {...getRootProps()}
                            isDragActive ={isDragActive}
                            isDragReject = {isDragReject}
                        >
                            <input {...getInputProps()}></input>
                            {this.dragMessage(isDragActive, isDragReject)}
                        </DropContainer>
                    )
                }
            </Dropzone>
        )
    }
}