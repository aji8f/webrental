import React, { useState } from 'react';

const GalleryModal = ({ isOpen, onClose, project }) => {
    if (!isOpen) return null;

    const [uploadedFiles, setUploadedFiles] = useState([
        { name: 'DSC_8829_Conference_Main.jpg', size: '4.2 MB', progress: 75, status: 'uploading' },
        { name: 'DSC_8834_Networking.jpg', size: '2.8 MB', progress: 100, status: 'ready' },
        { name: 'DSC_8901_Stage_Lights.jpg', size: '5.1 MB', progress: 100, status: 'ready' }
    ]);

    const handleClose = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in text-left font-display">
            <div className="bg-[#111722] border border-[#324467] rounded-xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#324467] bg-[#1a2332]/50">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">collections</span>
                            Manage Gallery Assets
                        </h3>
                        <p className="text-[#92a4c9] text-xs mt-0.5">Project: <span className="text-white font-medium">{project?.title || 'Unknown Project'}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-[#92a4c9] bg-[#1a2332] border border-[#324467] px-3 py-1 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1"></span>
                            System Online
                        </span>
                        <button onClick={handleClose} className="p-2 text-[#92a4c9] hover:text-white hover:bg-[#324467] rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="border-2 border-dashed border-[#324467] hover:border-primary/50 hover:bg-[#1a2332]/30 rounded-xl p-8 transition-all duration-300 group cursor-pointer text-center relative overflow-hidden">
                        <div className="flex flex-col items-center justify-center gap-3 relative z-10">
                            <div className="h-14 w-14 rounded-full bg-[#1a2332] border border-[#324467] flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Click to upload or drag and drop</h4>
                                <p className="text-[#92a4c9] text-sm mt-1">SVG, PNG, JPG or WEBP (MAX. 800x400px)</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Pending Uploads ({uploadedFiles.length})</h4>
                            <button className="text-xs text-[#92a4c9] hover:text-white flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">delete_sweep</span> Clear All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-4 bg-[#1a2332]/50 border border-[#324467] p-4 rounded-lg">
                                    <div className="w-full sm:w-48 aspect-video bg-black/40 rounded overflow-hidden relative border border-[#324467] shrink-0">
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-gray-600">image</span>
                                        </div>
                                        {file.status === 'ready' && (
                                            <div className="absolute top-2 right-2">
                                                <span className="bg-green-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">READY</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between w-full">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="w-full">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-white text-sm font-medium truncate">{file.name}</span>
                                                    <span className="text-[#92a4c9] text-xs">{file.size}</span>
                                                </div>
                                                <div className="w-full bg-[#111722] rounded-full h-1.5 mb-3 overflow-hidden">
                                                    <div className={`h-1.5 rounded-full ${file.status === 'ready' ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${file.progress}%` }}></div>
                                                </div>
                                            </div>
                                            <button className="text-[#92a4c9] hover:text-red-400 p-1">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-[#324467] bg-[#1a2332]/50 flex justify-between items-center">
                    <div className="text-xs text-[#92a4c9]">
                        <span className="text-white font-medium">{uploadedFiles.filter(f => f.status === 'ready').length}</span> assets ready to be added to project.
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-white hover:bg-[#324467] rounded-lg transition-colors border border-transparent hover:border-[#475e8a]">
                            Cancel
                        </button>
                        <button onClick={handleClose} className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GalleryModal;
