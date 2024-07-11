import prisma from "../DB/db.config.js";

// Increase the comment counter
export const incrementCommentCounter = async (post_id) => {
    await prisma.post.update({
        where: {
            id: Number(post_id),
        },
        data: {
            comment_count: {
                increment: 1,
            },
        },
    });
};

// Decrease the comment counter
export const decrementCommentCounter = async (post_id) => {
    await prisma.post.update({
        where: {
            id: Number(post_id),
        },
        data: {
            comment_count: {
                decrement: 1,
            },
        },
    });
};

// Fetch all comments
export const fetchComment = async (req, res) => {
    const comment = await prisma.comment.findMany({

        //Get the comment with it's user and post
        include:{
            user:true,
            post:{
                include:{
                    user:true,
                }
            }
        }
    })
    try {
        const comments = await prisma.comment.findMany({});
        return res.json({ status: 200, data: comments });
    } catch (error) {
        return res.status(500).json({ status: 500, error: error.message });
    }
};

// Create a comment
export const createComment = async (req, res) => {
    const { user_id, post_id, comment } = req.body;

    console.log("Received values:", { user_id, post_id, comment });

    if (!user_id || !post_id || !comment) {
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

        const newComment = await prisma.comment.create({
            data: {
                user_id: Number(user_id),
                post_id: Number(post_id),
                comment,
            },
        });

        await incrementCommentCounter(post_id);

        return res.json({ status: 200, data: newComment, msg: "Comment Created." });
    } catch (error) {
        if (error.code === 'P2003') {
            return res.status(400).json({ status: 400, msg: "Invalid user_id" });
        }
        return res.status(500).json({ status: 500, error: error.message });
    }
};

// Show a comment
export const showComment = async (req, res) => {
    const commentId = req.params.id;
    try {
        const comment = await prisma.comment.findFirst({
            where: {
                id: Number(commentId),
            },
        });

        if (!comment) {
            return res.status(404).json({ status: 404, msg: "Comment not found" });
        }

        return res.json({ status: 200, data: comment });
    } catch (error) {
        return res.status(500).json({ status: 500, error: error.message });
    }
};

// Update a comment
export const updateComment = async (req, res) => {
    const commentId = req.params.id;
    const { user_id, post_id, comment } = req.body;

    console.log("Received values for update:", { user_id, post_id, comment });

    if (!user_id || !post_id || !comment) {
        return res.status(400).json({ status: 400, msg: "Missing required fields" });
    }

    try {
        const existingComment = await prisma.comment.findUnique({
            where: {
                id: Number(commentId),
            },
        });

        if (!existingComment) {
            return res.status(404).json({ status: 404, msg: "Comment not found" });
        }

        const updatedComment = await prisma.comment.update({
            where: {
                id: Number(commentId),
            },
            data: {
                user_id: Number(user_id),
                post_id: Number(post_id),
                comment,
            },
        });

        return res.json({ status: 200, message: "Comment updated successfully" });
    } catch (error) {
        if (error.code === 'P2003') {
            return res.status(400).json({ status: 400, msg: "Invalid user_id" });
        }
        return res.status(500).json({ status: 500, error: error.message });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    const commentId = req.params.id;

    try {
        const comment = await prisma.comment.findUnique({
            where: {
                id: Number(commentId),
            },
        });

        if (!comment) {
            return res.status(404).json({ status: 404, msg: "Comment not found" });
        }

        await prisma.comment.delete({
            where: {
                id: Number(commentId),
            },
        });

        await decrementCommentCounter(comment.post_id);

        return res.json({ status: 200, msg: "Comment deleted successfully" });
    } catch (error) {
        return res.status(500).json({ status: 500, error: error.message });
    }
};
