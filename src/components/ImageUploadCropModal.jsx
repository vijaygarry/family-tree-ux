import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";

function getCroppedImg(imageSrc, crop, imageWidth, imageHeight) {
    return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = imageWidth;
            canvas.height = imageHeight;
            const ctx = canvas.getContext('2d');
            // Draw the cropped area of the image onto the canvas
            ctx.drawImage(
                image,
                crop.x, crop.y, crop.width, crop.height, // source crop
                0, 0, imageWidth, imageHeight              // destination size
            );
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Canvas is empty'));
                }
            }, 'image/jpeg');
        };
        image.onerror = () => {
            reject(new Error('Failed to load image'));
        };
    });
}

const ImageUploadCropModal = ({ modalHeading, onClose, onSave, imageWidth, imageHeight }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, imageWidth, imageHeight);
        onSave(croppedImage);
        onClose();
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{modalHeading}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {!imageSrc ? (
                            <div {...getRootProps()} className="border p-4 text-center" style={{ cursor: "pointer" }}>
                                <input {...getInputProps()} />
                                <p>Drag & drop image here, or click to browse</p>
                            </div>
                        ) : (
                            <div style={{ position: "relative", width: "100%", height: 600 }}>
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={imageWidth / imageHeight}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={!imageSrc}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadCropModal;