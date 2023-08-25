import router from 'express';
import { createBlog, deleteBlog, editBlog, getAllBlog, getSingleBlog } from '../controllers/blog';
import { parseFile } from '../middleware/fileParser';

const blogRouter = router.Router();
blogRouter.get('/blog', getAllBlog);
blogRouter.get('/blog/:id', getSingleBlog);
blogRouter.post('/blog', parseFile, createBlog )
blogRouter.put('/blog/:id', parseFile, editBlog )
blogRouter.delete('/blog/:id', deleteBlog )


export default blogRouter;
