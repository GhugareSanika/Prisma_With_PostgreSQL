import prisma from "../DB/db.config.js";

export const fetchPosts = async (req, res) => {
    
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    if(page <= 0){
        page=1
    }
    if(limit <= 0 || limit>100){
        limit = 10
    }
    const skip = (page-1)*limit;

    const posts = await prisma.post.findMany({
        skip:skip,
        take:limit,
        
        include:{
            comment:{
                include:{
                    user:{
                        select:{
                            name:true
                        }
                    }
                }
            }
        },

        orderBy:{
            id:"desc"
        },

        //Filter with the post Id
        where:{
            comment_count:{
                gt:1// where the comment count is greater than 1
            }
        }

    })

    // To get the total posts count
    const totalPosts = await prisma.post.count()
    const totalPages = Math.ceil(totalPosts / limit)

    try {
        const posts = await prisma.post.findMany({});
        return res.json({ 
            status: 200, 
            data: posts,
            meta:{
                totalPages,
                currentPage:page,
                limit:limit,
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 500, error: error.message });
    }
}


























// Create Post
export const createPost = async (req, res) => {
    const { user_id, title, description } = req.body;

    // Log the received values
    console.log("Received values:", { user_id, title, description });

    // Check if required fields are provided
    if (!user_id || !title || !description) {
        return res.status(400).json({ status: 400, msg: "Missing required fields" });
    }

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {
                id: Number(user_id),
            },
        });

        if (!user) {
            return res.status(404).json({ status: 404, msg: "User not found" });
        }

        const newPost = await prisma.post.create({
            data: {
                user_id: Number(user_id),
                title,
                description,
            },
        });

        return res.json({ status: 200, data: newPost, msg: "Post Created." });
    } catch (error) {
        if (error.code === 'P2003') { // Prisma's foreign key constraint error code
            return res.status(400).json({ status: 400, msg: "Invalid user_id" });
        }
        return res.status(500).json({ status: 500, error: error.message });
    }
}

// Show Post
export const showPost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await prisma.post.findFirst({
            where: {
                id: Number(postId),
            },
        });

        if (!post) {
            return res.status(404).json({ status: 404, msg: "Post not found" });
        }

        return res.json({ status: 200, data: post });
    } catch (error) {
        return res.status(500).json({ status: 500, error: error.message });
    }
}

// Update Post
export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const { user_id, title, description } = req.body;

    // Log the received values
    console.log("Received values for update:", { postId, user_id, title, description });

    // Check if required fields are provided
    if (!user_id || !title || !description) {
        return res.status(400).json({ status: 400, msg: "Missing required fields" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(user_id),
            },
        });

        if (!user) {
            return res.status(404).json({ status: 404, msg: "User not found" });
        }

        const updatedPost = await prisma.post.update({
            where: {
                id: Number(postId),
            },
            data: {
                user_id: Number(user_id),
                title,
                description,
            },
        });

        return res.json({ status: 200, message: "Post updated successfully" });
    } catch (error) {
        if (error.code === 'P2003') {
            return res.status(400).json({ status: 400, msg: "Invalid user_id" });
        }
        return res.status(500).json({ status: 500, error: error.message });
    }
}

// Delete Post
export const deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        await prisma.post.delete({
            where: {
                id: Number(postId),
            },
        });

        return res.json({ status: 200, msg: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ status: 500, error: error.message });
    }
}


//To search the post

export const searchPost = async (req , res) =>{
    const query = req.query.q
    const posts = await prisma.post.findMany({
        where:{
            description:{
                search:query
            }
        }
    })

    return res.json({status: 200, data:posts})
}