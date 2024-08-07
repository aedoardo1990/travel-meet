import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'

type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void;
    mediaUrl: string;
}

export const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    // empty array to pass multiple files
    const [file, setFile] = useState<File[]>([]);
    // in the fileUrl is of course only the file Url to pass
    const [fileUrl, setFileUrl] = useState(mediaUrl);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    }, [file]
    )

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg', '.svg']
        }
    })

    return (
        <div {...getRootProps()} className='flex flex-center flex-col bg-light-1 border border-gray-200 rounded-xl cursor-pointer'>
            <input {...getInputProps()} className='cursor-pointer' />
            {
                fileUrl ? (
                    <>
                        <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                            <img
                                src={fileUrl}
                                alt='image'
                                className='file_uploader-img'
                            />
                        </div>
                        <p className='file_uploader-label'>Click or drag photo or video to replace</p>
                    </>
                ) : (
                    <div className='file_uploader-box'>
                        <img
                            src='/assets/icons/file-upload.svg'
                            width={96}
                            height={77}
                            alt='file-upload'
                        />
                        <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag photos or videos here</h3>
                        <p className='text-light-4 small-regular mb-6'>
                            SVG, PNG, JPG
                        </p>
                        <Button className="shad-button_dark_4">
                            Select from computer
                        </Button>
                    </div>
                )
            }
        </div>
    )
}
