import prisma from "../DB/db.config.js";

export const fetchUsers = async (req,res) =>{
    const users = await prisma.user.findMany({

        //Display the user with it's post:
         
        // include:{
        //     post:{
        //         select:{
        //             title: true,
        //             comment_count:true,
        //         }
        //     }
        // }


        //Show the total number of post :

        // select:{
        //     _count:{
        //         select:{
        //             post:true,
        //             comment:true
        //         }
        //     }
        // }
    });

    return res.json({ status:200, data: users})
}

//Create User
export const createUser = async (req, res) =>{
    const {name, email,password} = req.body

    const findUser = await prisma.user.findUnique({
        where : {
            email:email
        }
    })

    if(findUser){
        return res.json({status:400,message:"Email Already Taken. Please Enter Another Email"})
    }

    const newUser = await prisma.user.create({
        data:{
            name:name,
            email:email,
            password:password
        }
    })

    return res.json({ status: 200, data: newUser, msg: "User Created."})
}

// Show user

export const showUser = async (req , res)=>{
    const userId = req.params.id
    const user = await prisma.user.findFirst({
        where:{
            id:Number(userId)
        }
    })

    return res.json({status:200 , data:user})

}

//Update user 

export const updateUser = async (req , res) =>{
    const userId = req.params.id //“id” property is available as req.params.id. This object defaults to {}
    
    const {name, email, password}= req.body;
    await prisma.user.update({
        where:{
            id:Number(userId)
        },
        data:{
            name,
            email,
            password
        }
    })

    return res.json({status: 200, message:"User updated successfully"})
}


//*delete User

export const deleteUser = async (req , res) =>{
    const userId= req.params.id;
    await prisma.user.delete({
        where:{
            id:Number(userId)
        }
    })

    return res.json({status:200 , msg:"User deleted successfully"})
}