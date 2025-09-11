import React, { useRef, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import html2pdf from 'html2pdf.js';

/**
 * ProfilePreview Component
 * 
 * Displays a live preview of the resume data in a professional format
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Resume data to display
 * @returns {JSX.Element} The ProfilePreview component
 */
const ProfilePreview = ({ data = {}, showPreviewOnly = false }) => {
  const resumeRef = useRef(null);
  const previewContainerRef = useRef(null); // Ref for the container to calculate available space

  // Helper function to check if a field has content
  const hasContent = (value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value && value.trim() !== '';
  };

  // Helper function to format skills as tags
  const formatSkills = (skillsString) => {
    if (!skillsString) return [];
    return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill);
  };

  // Education exists if any of the top-level fields have content
  const hasEducation = [data.degree, data.institution, data.educationDuration, data.educationLocation].some(v => hasContent(v));

  const [scale, setScale] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Calculate responsive scale to fit the A4 page within the available viewport
  useEffect(() => {
    const calculateScale = () => {
      if (!previewContainerRef.current) return;

      const container = previewContainerRef.current;
      const padding = 32; // 2rem total padding (p-4 = 1rem on each side)

      // Get available dimensions from the container
      const availableWidth = container.clientWidth - padding;
      const availableHeight = container.clientHeight - padding;
      
      const a4Width = 794; // A4 width in pixels (210mm at 96dpi)
      const a4Height = 1123; // A4 height in pixels (297mm at 96dpi)
      
      // Calculate scale based on both width and height constraints
      const widthScale = availableWidth / a4Width;
      const heightScale = availableHeight / a4Height;
      
      // Use the smaller scale to ensure the entire page fits without being cropped
      const baseScale = Math.min(widthScale, heightScale);
      
      // Apply the user-controlled zoom level, with a minimum scale
      const finalScale = Math.max(0.2, baseScale * zoomLevel);
      setScale(finalScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    // Also use a ResizeObserver for better responsiveness to container size changes
    const resizeObserver = new ResizeObserver(calculateScale);
    if (previewContainerRef.current) {
      resizeObserver.observe(previewContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', calculateScale);
      if (previewContainerRef.current) {
        resizeObserver.unobserve(previewContainerRef.current);
      }
    };
  }, [zoomLevel, showPreviewOnly]);

  const [pdfDimensions, setPdfDimensions] = useState({ width: '210mm', height: '297mm' });

  // Handle PDF export using html2pdf
  const handleExportPDF = async () => {
    if (!resumeRef.current) return;

    const element = resumeRef.current;

    // Temporarily remove fixed dimensions for PDF generation
    setPdfDimensions({ width: null, height: null });

    // Wait for the DOM to update
    await new Promise(resolve => setTimeout(resolve, 50));

    const opt = {
      filename: `${data.fullName || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { 
        scale: 3, /* Increased scale for better clarity */
        useCORS: true,
        allowTaint: true,
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true,
        putOnlyUsedFonts: true
      },
      pagebreak: { mode: 'avoid-all', before: '.page-break', after: '.page-break' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Fallback to print if PDF generation fails
      window.print();
    } finally {
      // Reset dimensions after PDF generation
      setPdfDimensions({ width: '210mm', height: '297mm' });
    }
  };

  // Zoom control functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="w-full max-w-none relative h-full flex flex-col">
      {/* Export Button and Zoom Controls - Only show when in preview-only mode */}
      {showPreviewOnly && (
        <div className="flex justify-between items-center mb-4 print:hidden px-4">
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleZoomOut}
              variant="outline"
              size="sm"
              className="px-3 py-1 text-xs"
            >
              Zoom Out
            </Button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(zoomLevel * scale * 100 / (scale / zoomLevel))}%
            </span>
            <Button 
              onClick={handleZoomIn}
              variant="outline"
              size="sm"
              className="px-3 py-1 text-xs"
            >
              Zoom In
            </Button>
            <Button 
              onClick={handleResetZoom}
              variant="outline"
              size="sm"
              className="px-3 py-1 text-xs ml-2"
            >
              Reset
            </Button>
          </div>
          <Button 
            onClick={handleExportPDF} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg"
          >
            Export as PDF
          </Button>
        </div>
      )}

      {/* A4 Page Container with responsive scaling */}
      <div 
        ref={previewContainerRef} 
        className="flex-1 flex justify-center items-center overflow-hidden p-4"
      >
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center', // Changed from 'top center'
        }}>
          <div 
            ref={resumeRef}
            className="bg-white shadow-2xl" 
            style={{ 
              width: pdfDimensions.width, 
              height: pdfDimensions.height, 
              overflow: 'hidden' // Prevent content overflow to ensure single page
            }}
          >
          
          {/* Header */}
          <div className="header bg-white border-b-2 border-blue-600 px-8 py-5">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {hasContent(data.fullName) ? data.fullName : 'Your Name'}
              </h1>
              <p className="title text-lg text-blue-600 mb-3">
                {hasContent(data.professionalTitle) ? data.professionalTitle : 'Your Title'}
              </p>
              <div className="contact-info flex justify-center items-center space-x-8 text-sm text-gray-600">
                {hasContent(data.phone) && (
                  <span className="contact-item flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {data.phone}
                  </span>
                )}
                {hasContent(data.email) && (
                  <span className="contact-item flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {data.email}
                  </span>
                )}
                {hasContent(data.location) && (
                  <span className="contact-item flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {data.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="content px-8 py-5 space-y-4">
            {/* Skills Section */}
            {hasContent(data.skills) && (
              <section className="section">
                <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b border-gray-400 uppercase tracking-wide">
                  SKILLS
                </h2>
                <div className="skills flex flex-wrap gap-2">
                  {formatSkills(data.skills).map((skill, index) => (
                    <span key={index} className="skill-tag bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Experience Section */}
            {hasContent(data.experience) && (
              <section className="section">
                <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b border-gray-400 uppercase tracking-wide">
                  EXPERIENCE
                </h2>
                <div className="space-y-3">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="experience-item">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{exp.title || exp.position}</h3>
                          <p className="company text-sm text-blue-600 font-medium">{exp.company}</p>
                        </div>
                        <p className="duration text-xs text-gray-600 text-right">{exp.duration}</p>
                      </div>
                      {(() => {
                        const toArray = (val) => Array.isArray(val) ? val : (typeof val === 'string' ? val.split('\n') : []);
                        const items = toArray(exp.description).map(it => it.trim()).filter(it => hasContent(it));
                        return items.length ? (
                          <ul className="description list-disc pl-5 text-xs text-gray-700 space-y-0.5">
                            {items.map((d, i) => (
                              <li key={i}>{d}</li>
                            ))}
                          </ul>
                        ) : null;
                      })()} 
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education Section */}
            {hasEducation && (
              <section className="section">
                <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b border-gray-400 uppercase tracking-wide">
                  EDUCATION
                </h2>
                <div className="">
                  {hasContent(data.degree) && (
                    <h3 className="text-sm font-semibold text-gray-900">{data.degree}</h3>
                  )}
                  {hasContent(data.institution) && (
                    <p className="company text-sm text-blue-600 font-medium">{data.institution}</p>
                  )}
                  {([data.educationDuration, data.educationLocation].filter(v => hasContent(v)).length > 0) && (
                    <p className="duration text-xs text-gray-600">{
                      [data.educationDuration, data.educationLocation].filter(v => hasContent(v)).join(' • ')
                    }</p>
                  )}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {hasContent(data.projects) && (
              <section className="section">
                <h2 className="text-base font-bold text-gray-900 mb-2 pb-1 border-b border-gray-400 uppercase tracking-wide">
                  PROJECTS
                </h2>
                <div className="space-y-3">
                  {data.projects.map((project, index) => (
                    <div key={index} className="project-item">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{project.name}</h3>
                        <p className="duration text-xs text-gray-600 text-right">{project.duration}</p>
                      </div>
                      {(() => {
                        const toArray = (val) => Array.isArray(val) ? val : (typeof val === 'string' ? val.split('\n') : []);
                        const items = toArray(project.description).map(it => it.trim()).filter(it => hasContent(it));
                        return items.length ? (
                          <ul className="description list-disc pl-5 text-xs text-gray-700 space-y-0.5">
                            {items.map((d, i) => (
                              <li key={i}>{d}</li>
                            ))}
                          </ul>
                        ) : null;
                      })()} 
                      {project.technologies && (
                        <p className="technologies text-xs text-blue-600 mt-1">Technologies: {project.technologies}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {!hasContent(data.fullName) && !hasContent(data.experience) && !hasEducation && !hasContent(data.skills) && !hasContent(data.projects) && (
              <div className="empty-state text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
                <p className="text-gray-500">Start filling out the resume form to see your preview here.</p>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;