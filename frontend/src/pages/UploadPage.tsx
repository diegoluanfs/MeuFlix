import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { uploadVideo } from '../api/videos';
import UploadProgress from '../components/UploadProgress/UploadProgress';
import Layout from '../components/Layout/Layout';

const Title = styled.h1`
  font-size: 1.6rem;
  color: #e5e5e5;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  background: #1f1f1f;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  color: #aaa;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #e5e5e5;
  font-size: 0.95rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #e5e5e5;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const FileDropZone = styled.div<{ $hasFile: boolean }>`
  border: 2px dashed ${({ $hasFile }) => ($hasFile ? '#1db954' : '#444')};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $hasFile }) => ($hasFile ? 'rgba(29, 185, 84, 0.05)' : 'transparent')};

  &:hover {
    border-color: ${({ $hasFile }) => ($hasFile ? '#1db954' : '#e50914')};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const DropText = styled.p`
  color: #aaa;
  font-size: 0.9rem;
`;

const FileName = styled.p`
  color: #1db954;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  padding: 0.85rem;
  background: #e50914;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #c40812;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorBox = styled.div`
  background: rgba(229, 9, 20, 0.15);
  border: 1px solid #e50914;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #ff6b6b;
`;

const SuccessBox = styled.div`
  background: rgba(29, 185, 84, 0.15);
  border: 1px solid #1db954;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #1db954;
`;

const ProcessingNote = styled.p`
  font-size: 0.8rem;
  color: #666;
  text-align: center;
`;

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadedId, setUploadedId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Selecione um arquivo de vídeo.');
      return;
    }
    setError(null);
    setSuccess(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const video = await uploadVideo(title, description, file, (event) => {
        if (event.total) {
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        }
      });
      setSuccess('Upload realizado com sucesso! Processando...');
      setUploadedId(video.id);
      setTimeout(() => navigate(`/videos/${video.id}`), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao fazer upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <Title>Upload de Vídeo</Title>
      <Form onSubmit={handleSubmit}>
        {error && <ErrorBox>{error}</ErrorBox>}
        {success && <SuccessBox>{success}</SuccessBox>}

        <InputGroup>
          <Label>Título *</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do vídeo"
            required
            disabled={uploading}
          />
        </InputGroup>

        <InputGroup>
          <Label>Descrição</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o vídeo (opcional)"
            disabled={uploading}
          />
        </InputGroup>

        <InputGroup>
          <Label>Arquivo de vídeo *</Label>
          <FileDropZone
            $hasFile={!!file}
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <DropText>
              {file ? '✅ Arquivo selecionado' : '📁 Clique ou arraste o arquivo aqui'}
            </DropText>
            {file && <FileName>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</FileName>}
          </FileDropZone>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
          />
        </InputGroup>

        {uploading && (
          <>
            <UploadProgress
              percent={uploadProgress}
              label={uploadProgress < 100 ? 'Enviando arquivo...' : 'Processando...'}
            />
            <ProcessingNote>
              O processamento pode levar alguns minutos dependendo do tamanho do vídeo.
            </ProcessingNote>
          </>
        )}

        <SubmitButton type="submit" disabled={uploading || !!uploadedId}>
          {uploading ? 'Enviando...' : 'Fazer Upload'}
        </SubmitButton>
      </Form>
    </Layout>
  );
};

export default UploadPage;
