import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

function FormResume(props) {
    const handleEditorChange = (content, editor) => {
        console.log(`Content was updated: ${content}`);
    };

    return (
        <div className="form-resume">
            <Editor
                apiKey="zkqnr88xpimb3d5neqkp3rtzm2ecyu7s5v7j23ov5102hvbb"
                initialValue=""
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: `undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help`
                }}
                onEditorChange={handleEditorChange}
            />
        </div>
    );
}

export default FormResume;
