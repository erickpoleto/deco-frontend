import React from 'react'
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';
import { MdCheckCircle, MdLink, MdError } from 'react-icons/md'


import { Container, FileInfo, Preview} from './styles'
import Upload from '../Upload'

export const FileList = ({ files, onDelete }) => {
    return(
    <Container>
        {files.map(uploadedFile => (
            <li key={uploadedFile.id}>
            <FileInfo>
                <Preview src={uploadedFile.preview}>
                </Preview>
                <div>
                    <strong>{uploadedFile.name}</strong>
                    <span>{uploadedFile.readableSize}<button onClick={()=> onDelete(uploadedFile.id)}>Excluir</button></span>
                </div>
            </FileInfo>
            <div>
                {!uploadedFile.uploaded && !uploadedFile.error && (
                    <CircularProgressbar
                        styles={{
                            root: { width: 24 },
                            path: { stroke: '#7159c1'}
                        }}
                        strokeWidth={10}
                        value={uploadedFile.progress}
                    />
                    
                )}
                {uploadedFile.url && (
                    <a href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    ><MdLink style={{ marginRigth: 8}} size={24} color="#222"></MdLink></a>
                )}
                {uploadedFile.uploaded && (
                    <MdCheckCircle size={24} color="#78e5d5"></MdCheckCircle>
                )}
                {uploadedFile.error && (<MdError size={24} color="#e57878"></MdError>)}
            </div>
        </li>
        ))}
    </Container>
    )
}