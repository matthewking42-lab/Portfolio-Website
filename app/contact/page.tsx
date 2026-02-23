'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-white pt-14">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-5 h-px bg-accent" />
            <span className="font-mono text-accent text-xs tracking-[0.18em] uppercase">Get in Touch</span>
          </div>
          <h1 className="font-mono text-4xl md:text-5xl text-gray-900 font-light">Contact</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left — links */}
          <div className="space-y-4">
            <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
              For project enquiries or professional opportunities, LinkedIn is the best way
              to reach me. Alternatively, use the form opposite.
            </p>

            {/* LinkedIn card */}
            <a
              href="https://www.linkedin.com/in/matthew-king-88b395161/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 border border-gray-200 hover:border-accent-border hover:bg-accent-light transition-all group"
            >
              <div className="w-10 h-10 bg-gray-50 group-hover:bg-white border border-gray-200 group-hover:border-accent-border flex items-center justify-center flex-shrink-0 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 group-hover:text-accent transition-colors">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-accent transition-colors text-sm">
                  LinkedIn
                </div>
                <div className="text-gray-400 text-xs font-mono mt-0.5">
                  matthew-king-88b395161
                </div>
              </div>
              <svg
                className="ml-auto text-gray-300 group-hover:text-accent transition-colors"
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                stroke="currentColor" strokeWidth="1.5"
              >
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 border border-gray-100 bg-gray-50">
                <div className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">Based</div>
                <div className="text-gray-700 text-sm">United Kingdom</div>
              </div>
              <div className="p-5 border border-gray-100 bg-gray-50">
                <div className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-1">Employer</div>
                <div className="text-gray-700 text-sm">AmcoGiffen</div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="border border-gray-200 p-8">
            <h2 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-6">
              Send a Message
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-12 h-12 bg-accent-light border border-accent-border flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#16a34a" strokeWidth="2">
                    <polyline points="4 10 8 14 16 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm text-center">
                  Message sent. I&apos;ll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Name', type: 'text', placeholder: 'Your name', required: true },
                  { label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
                  { label: 'Subject', type: 'text', placeholder: 'Project enquiry', required: false },
                ].map(({ label, type, placeholder, required }) => (
                  <div key={label}>
                    <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      required={required}
                      placeholder={placeholder}
                      className="w-full border border-gray-200 focus:border-accent focus:outline-none px-3 py-2.5 text-gray-900 text-sm transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Your message…"
                    className="w-full border border-gray-200 focus:border-accent focus:outline-none px-3 py-2.5 text-gray-900 text-sm transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary text-center"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
