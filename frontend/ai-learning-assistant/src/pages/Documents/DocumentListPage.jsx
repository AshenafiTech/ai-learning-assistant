import React, { useState, useEffect } from 'react'
import { Plus, Upload, FileText, X } from 'lucide-react'
import toast from "react-hot-toast"

import documentService from '../../services/documentService'
import Spinner from '../../components/common/Spinner'
import DocumentCard from '../../components/documents/DocumentCard'
import Button from '../../components/common/Button'

const DocumentListPage = () => {

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // State for delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const res = await documentService.getDocuments();
      const list = res?.data || res?.documents || res || [];
      setDocuments(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error("Failed to load documents.");
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("Please select a file to upload.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);  

    try {
        await documentService.uploadDocument(formData);
        toast.success("Document uploaded successfully.");
        setIsUploadModalOpen(false);
        setUploadFile(null);
        setUploadTitle("");
        setLoading(true);
        fetchDocuments();
    } catch (error) {
        toast.error("Failed to upload document.");
    } finally {
        setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDoc) return;
    setDeleting(true);

    const docId = selectedDoc._id;
    const docTitle = selectedDoc.title;

    // Optimistic update: remove from UI and close modal immediately
    setIsDeleteModalOpen(false);
    setSelectedDoc(null);
    setDocuments((prev) => prev.filter((d) => d._id !== docId));

    try {
      await documentService.deleteDocument(docId);
      toast.success(`Document "${docTitle}" deleted successfully.`);
    } catch (error) {
      toast.error(error?.message || "Failed to delete document. Restoring list...");
      // Re-fetch documents to restore state
      setLoading(true);
      await fetchDocuments();
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className='flex items-center justify-center min-h-[400px]'>
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
        return (
            <div className='flex items-center justify-center min-h-[400px]'>
                <div className='text-center max-w-md'>
                    <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 shadow-lg shadow-indigo-200/30 mb-6'>
                        <FileText
                            className='w-10 h-10 text-indigo-500'
                            strokeWidth={1.5}
                        />
                    </div>
                    <h3 className='text-xl font-medium text-slate-900 tracking-tight mb-2'>
                        No Documents Found
                    </h3>
                    <p className='text-sm text-indigo-600/70 mb-6'>
                        Get started by uploading your first document to create flashcards and quizzes.
                    </p>
                    <button
                    
                      onClick={() => setIsUploadModalOpen(true)}
                      className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 active:scale-[0.98]'
                    >
                        <Plus className='w-4 h-4' strokeWidth={2.5} />
                        Upload Document

                    </button>
                </div>
            </div>
        );
    }

    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={() => handleDeleteRequest(doc)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className='min-h-screen'>
        {/* Subtle background pattern */}
        <div className='absolute inset-0 bg-[radial-gradient(#c7d2fe_1px,transparent_1px)] bg-[length:16px_16px] opacity-20 pointer-events-none' />

        <div className='relative max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-10'>
            <div>
                <h1 className='text-2xl font-medium text-slate-900 tracking-tight mb-2'>
                    My Documents
                </h1>
                <p className='text-indigo-600/80 text-sm'> 
                    Manage and organize your learning materials.
                </p>
            </div>
            {documents.length > 0 && (
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-white text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200'
                >
                  <Plus className='w-4 h-4' strokeWidth={2.5} />
                  Upload Document
                </Button>
            )}
        </div>

        {renderContent()}
        </div>

        {isUploadModalOpen && ( <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className='relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-indigo-100/60 rounded-2xl shadow-indigo-900/20 p-8'>
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="absolute top-6 right-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-indigo-200 bg-white text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <X className='w-5 h-5' strokeWidth={2.25} />
                </button>

                  {/* Modal Header */}
                  <div className='mb-6'>    
                    <h2 className='text-xl font-medium text-slate-900 tracking-tight'>
                        Upload New Document
                    </h2>
                    <p className='text-sm text-indigo-600/70 mt-1'>
                        Add a PDF Document to your library.
                    </p>
                  </div>

                  {/* Upload Form */}
                  <form onSubmit={handleUpload} className='space-y-5'>
                    {/* Title Input */}
                    <div className='space-y-2'>
                        <label className='block text-xs font-semibold text-indigo-700 uppercase tracking-wide'>
                            Document Title
                        </label>
                        <input
                          type="text"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          required
                          className='w-full h-12 px-4 border-2 border-indigo-100 rounded-xl bg-indigo-50/30 text-slate-900
                          placeholder-indigo-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:bg-white focus:shadow-lg focus:shadow-indigo-500/10'
                          placeholder='Enter document title'
                        />
                    </div>

                    {/* File Upload */}

                    <div className='space-y-2'>
                        <label className='block text-xs font-semibold text-indigo-700 uppercase tracking-wide'>
                            Select PDF File
                        </label>
                        <div className='relative border-2 border-dashed border-indigo-200 rounded-xl 
                        bg-indigo-50/30 hover:bg-indigo-100/50 transition-all duration-200'>
                            <input
                              id="file-upload"
                              type="file"
                              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
                              onChange={handleFileChange}
                              accept=".pdf"
                            />

                            <div className='flex flex-col items-center justify-center py-10 px-6'>
                                <div className='w-14 h-14 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center mb-4'>
                                    <Upload
                                        className='w-7 h-7 text-indigo-600'
                                        strokeWidth={2}
                                    />
                                </div>
                                <p className='text-sm font-medium text-slate-700 mb-1'>
                                    {uploadFile ? (
                                        <span className='text-indigo-600'>
                                            {uploadFile.name}
                                        </span>
                                    ): (
                                        <>
                                            <span className='text-indigo-600'>
                                                Click to upload
                                            </span>{" "}
                                            or drag and drop a PDF file here.
                                        </>
                                    )}
                                </p>
                                <p className='text-xs text-indigo-600/70'>
                                    PDF files only. Max size 10MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}

                    <div className='flex gap-3 pt-2'> 
                        <button
                            type="button"
                            onClick={() => setIsUploadModalOpen(false)}
                            disabled={uploading}
                            className='flex-1 h-11 px-4 border-2 border-indigo-200 rounded-xl bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className='flex-1 h-11 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30  disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'
                        >
                            {uploading ? (
                                <span className='flex items-center justify-center gap-2'>
                                    <div className='w-4 h-4 border-2 border-white/30 border-t-white/30 rounded-full animate-spin' />
                                        Uploading...
            
                                </span>
                            ) : (
                                "Upload Document"
                            )}
                        </button>
                    </div>
                  </form>
            </div>
        </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className='relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-indigo-100/60 rounded-2xl shadow-indigo-900/20 p-6'>
              <div className='mb-4'>
                <h2 className='text-lg font-semibold text-slate-900'>Confirm deletion</h2>
                <p className='text-sm text-indigo-600/70 mt-1'>Are you sure you want to delete this document? This action cannot be undone.</p>
              </div>

              <div className='text-sm text-indigo-700 mb-6'>
                <strong>{selectedDoc?.title}</strong>
              </div>

              <div className='flex gap-3 justify-end'>
                <button
                  type='button'
                  onClick={() => { setIsDeleteModalOpen(false); setSelectedDoc(null); }}
                  disabled={deleting}
                  className='flex-1 h-11 px-4 border-2 border-indigo-200 rounded-xl bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Cancel
                </button>

                <button
                  type='button'
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className='flex-1 h-11 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'
                >
                  {deleting ? (
                    <span className='flex items-center justify-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white/30 rounded-full animate-spin' />
                      Deleting...
                    </span>
                  ) : (
                    'Delete Document'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
};

export default DocumentListPage;