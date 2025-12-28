import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ children }) => {
  return (
    <div className='text-slate-700'>
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({node, ...props}) => <h1 className='text-3xl font-bold mt-8 mb-4 text-slate-900 border-b border-indigo-100 pb-2' {...props} />,
                h2: ({node, ...props}) => <h2 className='text-2xl font-bold mt-6 mb-3 text-slate-900' {...props} />,
                h3: ({node, ...props}) => <h3 className='text-xl font-semibold mt-5 mb-2 text-slate-900' {...props} />,
                h4: ({node, ...props}) => <h4 className='text-lg font-semibold mt-4 mb-2 text-slate-900' {...props} />,
                p: ({node, ...props}) => <p className='mb-4 leading-relaxed text-slate-700 text-base' {...props} />,
                a: ({node, ...props}) => <a className='text-indigo-600 hover:text-indigo-700 hover:underline font-medium' {...props} />,
                ul: ({node, ...props}) => <ul className='list-disc list-outside mb-4 ml-6 space-y-2' {...props} />,
                ol: ({node, ...props}) => <ol className='list-decimal list-outside mb-4 ml-6 space-y-2' {...props} />,
                li: ({node, ...props}) => <li className='mb-1 leading-relaxed text-slate-700' {...props} />,
                strong: ({node, ...props}) => <strong className='font-semibold text-slate-900' {...props} />,
                em: ({node, ...props}) => <em className='italic' {...props} />,
                blockquote: ({node, ...props}) => <blockquote className='border-l-4 border-indigo-400 bg-indigo-50/50 pl-6 py-3 my-6 rounded-r-lg italic text-indigo-700' {...props} />,
                code: ({node, inline, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <div className='my-6 rounded-xl overflow-hidden shadow-lg'>
                          <SyntaxHighlighter
                              style={dracula}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{
                                margin: 0,
                                borderRadius: '0.75rem',
                                padding: '1rem',
                                fontSize: '0.875rem',
                              }}
                              {...props}
                          >
                              {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code className='bg-indigo-100 text-indigo-700 rounded px-2 py-1 font-mono text-sm border border-indigo-200' {...props}>
                            {children}
                        </code>
                    );
                },
                pre: ({node, ...props}) => <pre className='bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto font-mono text-sm my-6 shadow-lg' {...props} />,
                hr: ({node, ...props}) => <hr className='my-8 border-0 border-t border-indigo-200' {...props} />,
                table: ({node, ...props}) => <div className='overflow-x-auto my-6'><table className='min-w-full border-collapse border border-indigo-200 rounded-lg' {...props} /></div>,
                th: ({node, ...props}) => <th className='border border-indigo-200 bg-indigo-50 px-4 py-3 text-left font-semibold text-slate-900' {...props} />,
                td: ({node, ...props}) => <td className='border border-indigo-200 px-4 py-3 text-slate-700' {...props} />,
            }}
        >
            {children}
        </ReactMarkdown>
      
    </div>
  )
}

export default MarkdownRenderer
