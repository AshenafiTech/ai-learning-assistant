import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import ChatInterface from "../../components/chat/ChatInterface";
import AIActions from "../../components/ai/AIActions";
import FlashcardManager from "../../components/flashcards/FlashcardManager";
import QuizManager from "../../components/quizzes/QuizManager";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        // documentService now returns the document object directly
        setDocument(data);
      } catch (error) {
        toast.error("Failed to load document details.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  // Helper function to get the full PDF URL
  const getPdfUrl = () => {
    if (!document?.filePath) return null;

    const filePath = document.filePath;

    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    const baseUrl =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (!document || !document.filePath) {
      return <div className="text-center p-8">PDF not available</div>;
    }

    const pdfUrl = getPdfUrl();

    return (
      <div className="rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-indigo-100">
          <div>
            <div className="text-sm text-indigo-600/70">Document</div>
            <div className="text-base font-semibold text-slate-900 truncate max-w-xl">
              {document.title}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full PDF in new tab"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        <div className="bg-white">
          <div className="w-full h-[80vh] bg-gray-50">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full bg-white"
                title="Document Viewer"
                style={{ border: "none" }}
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-slate-500">
                PDF not available
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface />;
  };

  const renderAIActions = () => {
    return <AIActions />;
  };

  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={id} />;
  };

  const renderQuizzesTab = () => {
    return <QuizManager documentId={id} />;
  };

  const tabs = [
    { name: "Content", label: "Document Content", content: renderContent },
    { name: "Chat", label: "AI Chat", content: renderChat },
    { name: "AI Actions", label: "AI Tools", content: renderAIActions },
    {
      name: "Flashcards",
      label: "Study Flashcards",
      content: renderFlashcardsTab,
    },
    { name: "Quizzes", label: "Practice Quizzes", content: renderQuizzesTab },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!document) {
    return <div className="text-center p-8">Document not found.</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>
      <PageHeader title={document.title} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentDetailPage;
