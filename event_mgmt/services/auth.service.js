async function RegisterUserService(body) {
    try {

        const { username, email, password, role } = body;

        //findOne is a mongoose method here
        const userExists = await UserModel.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            console.log('username or email already exists');
            return { message: 'Username or email already exists', status: 400 };
        }
        //we're using async in bcrypt.hash function because .hash function returns a promise
        const hashedPassword = await bcrypt.hash(password, 5);

        const user = new UserModel({
            username,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        return { message: `User registered successfully + ${user._id}`, status: 201 };
    }
    catch (error) {
        console.error('Error registering user :', error);
        return { message: 'Failed to register user', status: 500 };
    }

}

module.exports = {RegisterUserService};