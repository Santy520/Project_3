const { User, Book, Club, Topic, Post } = require('../models');
const { formatDate } = require('../utils/dateFormat');
const { AuthenticationError } = require('apollo-server-express');  // For handling authentication
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // GET ALL USERS
        users: async () => {
            try {
                return await User.find({});
            } catch (err) {
                throw new Error('Error fetching users');
            }
        },

        // GET ALL BOOKS
        books: async () => {
            try {
                return await Book.find({}); 
            } catch (err) {
                throw new Error('Error fetching books');
            }
        },

        // GET ALL CLUBS
        clubs: async () => {
            try {
                return await Club.find({});
            } catch (err) {
                throw new Error('Error fetching clubs');
            }
        },

        // GET ALL TOPICS
        topics: async () => { // Update to fetch topics
            try {
                console.log("The topics are ", await Topic.find({}))
                return await Topic.find({});
            } catch (err) {
                throw new Error('Error fetching topics');
            }
        },

        // GET ALL POSTS
        posts: async () => { // Update to fetch posts
            try {
                return await Post.find({});
            } catch (err) {
                throw new Error('Error fetching posts');
            }
        },

        // GET BOOK BY ID
        book: async (parent, { id }) => {
            try {
                return await Book.findById(id);
            } catch (err) {
                throw new Error('Error fetching book');
            }
        },

        // GET CLUB BY ID
        club: async (parent, { id }) => {
            try {
                return await Club.findById(id);
            } catch (err) {
                throw new Error('Error fetching club');
            }
        },

        // GET USER BY ID
        user: async (parent, { id }) => {
            try {
                return await User.findById(id);
            } catch (err) {
                throw new Error('Error fetching user');
            }
        },

        // GET TOPIC BY ID
        topic: async (parent, { id }) => { // Add resolver for fetching a single topic
            try {
                return await Topic.findById(id);
            } catch (err) {
                throw new Error('Error fetching topic');
            }
        },

        // GET POST BY ID
        post: async (parent, { id }) => {
            try {
                 return await Post.findById(id);
            } catch (err) {
                throw new Error('Error fetching post');
            }
     },
    },

    

    Mutation: {

        // ADD USER
        addUser: async (parent, { name, email, password }) => {
            try {
                const user = await User.create({ name, email, password });
                const token = signToken(user);
                return { token, user };
            } catch (err) {
                throw new Error('Error adding user: ' + err.message);
            }
        },

        // LOGIN
        login: async (parent, { email, password }) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    throw new AuthenticationError('No user found with this email address.');
                }

                const correctPw = await user.isCorrectPassword(password);

                if (!correctPw) {
                    throw new AuthenticationError('Incorrect password.');
                }

                const token = signToken(user);

                return { token, user };
            } catch (err) {
                throw new Error('Error logging in: ' + err.message);
            }
        },

        // UPDATE USER
        updateUser: async (parent, { id, ...args }) => {
            try {
                return await User.findByIdAndUpdate(id, args, { new: true });
            } catch (err) {
                throw new Error('Error updating user');
            }
        },

        // DELETE USER
        deleteUser: async (parent, { id }) => {
            try {
                return await User.findByIdAndDelete(id);
            } catch (err) {
                throw new Error('Error deleting user');
            }
        },

        // ADD BOOK
        addBook: async (parent, args) => {
            try {
                const book = new Book(args);
                return await book.save();
            } catch (err) {
                throw new Error('Error adding book');
            }
        },

        // UPDATE BOOK
        updateBook: async (parent, { id, ...args }) => {
            try {
                return await Book.findByIdAndUpdate(id, args, { new: true });
            } catch (err) {
                throw new Error('Error updating book');
            }
        },

        // DELETE BOOK
        deleteBook: async (parent, { id }) => {
            try {
                return await Book.findByIdAndDelete(id);
            } catch (err) {
                throw new Error('Error deleting book');
            }
        },

        // ADD CLUB
        addClub: async (parent, args) => {
            try {
                const club = new Club(args);
                return await club.save();
            } catch (err) {
                throw new Error('Error adding club');
            }
        },

        // UPDATE CLUB
        updateClub: async (parent, { id, ...args }) => {
            try {
                return await Club.findByIdAndUpdate(id, args, { new: true });
            } catch (err) {
                throw new Error('Error updating club');
            }
        },

        // DELETE CLUB
        deleteClub: async (parent, { id }) => {
            try {
                return await Club.findByIdAndDelete(id);
            } catch (err) {
                throw new Error('Error deleting club');
            }
        },

// ADD TOPIC
    addTopic: async (parent, args) => {
    try {
        const topic = await Topic.create(args);
        console.log("The topic object is:", topic);
        return topic;
    } catch (err) {
        console.error('Error adding topic:', err);
        throw new Error('Error adding topic: ' + err.message);
    }
},

        // UPDATE TOPIC
        updateTopic: async (parent, { id, ...args }) => {
            try {
                return await Topic.findByIdAndUpdate(id, args, { new: true });
            } catch (err) {
                throw new Error('Error updating topic');
            }
        },

        // DELETE TOPIC
        deleteTopic: async (parent, { id }) => {
            try {
                return await Topic.findByIdAndDelete(id);
            } catch (err) {
                throw new Error('Error deleting topic');
            }
        },

        // ADD POST
        addPost: async (parent, args) => {
            try {
                const post = new Post(args);
                return await post.save();
            } catch (err) {
                throw new Error('Error adding post');
            }
        },

        // UPDATE POST
        updatePost: async (parent, { id, ...args }) => {
            try {
                return await Post.findByIdAndUpdate(id, args, { new: true });
            } catch (err) {
                throw new Error('Error updating post');
            }
        },

        // DELETE POST
        deletePost: async (parent, { id }) => {
            try {
                return await Post.findByIdAndDelete(id);
            } catch (err) {
                throw new Error('Error deleting post');
            }  
        },

    },


        Topic: { // 🟢 Adding the Topic resolver here
            clubId: async (parent) => {
                return await Club.findById(parent.clubId);
            },
            authorId: async (parent) => {
                return await User.findById(parent.authorId);
            },
            bookId: async (parent) => {
                if (parent.bookId) {
                    const book = await Book.findById(parent.bookId);
                    if (!book) {
                        throw new Error(`Book with ID ${parent.bookId} not found`);
                    }
                    return book;
                }
                return null;
            },
            posts: async (parent) => {
                return await Post.find({ _id: { $in: parent.posts } });

            },

    },
};

module.exports = resolvers;
