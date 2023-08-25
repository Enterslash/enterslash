import fileUpload from 'express-fileupload';

export const parseFile = fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
})