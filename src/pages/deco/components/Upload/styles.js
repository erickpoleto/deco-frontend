import styled, {css} from 'styled-components';

const dragActive = css`
    border-color: #13C600;
`
const dragReject = css`
    border-color: #AA0000;
`

export const DropContainer = styled.div.attrs({className:"dropzone"})`
    border: 1px dashed #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: height 0.2s ease; 
    display: flex;
    justify-content: center;
    padding: 15px;
    ${props => props.isDragActive && dragActive}
    ${props => props.isDragReject && dragReject}
`;

const messageColors = {
    default: '#999',
    error: '#AA0000',
    success: '#13C600'
};

export const UploadMessage = styled.p`
    display: flex;
    color: ${props => messageColors[props.type || 'default']};
    justify-content: center;
    align-items: center;
    padding: 15px 0;
`;