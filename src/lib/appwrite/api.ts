import { ID, Query } from "appwrite";
import { INewUser, INewPost, IUpdatePost, IUpdateUser, INewComment, IUpdateComment } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        })

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )

        return newUser;
    } catch (error) {
        console.log(error);
    }
}

export async function signInAccount(user: { email: string; password: string; }) {
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password);

        return session;
    } catch (error) {
        console.log(error);
    }
}

// ============================== GET ACCOUNT
export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        console.log(error);
    }
}

// async function to retrieve current user
export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        //if there is no account, error will be thrown
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;
        // if we don t have the user, error will be displayed
        //otherwise it will return as below
        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}


// async function to SignOut provided by appwrite
export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current')
        return session;
    } catch (error) {
        console.log(error);
    }
}

//function to create Post
export async function createPost(post: INewPost) {
    try {
        //upload image to storage
        const uploadedFile = await uploadFile(post.file[0]);

        if (!uploadedFile) throw Error;
        //Get file url
        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            await deleteFile(uploadedFile.$id)
            throw Error;
        }

        //convert tags to an array
        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        //save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
            }
        )

        if (!newPost) {
            await deleteFile(uploadedFile.$id)
            throw Error;
        }
        return newPost;
    } catch (error) {
        console.log(error);
    }
}

// function to upload file of Post in the storage
export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile;
    } catch (error) {
        console.log(error)
    }
}

export function getFilePreview(fileId: string ) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            undefined, //BUG TO FIX
            100,
        );
        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        console.log(error)
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
        return { status: 'ok' };
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
    if (!posts) throw Error;

    return posts;
}

// array to know the IDs of people who liked the post
export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )

        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(), // instead of PostId cause it is new post
            {
                user: userId,
                post: postId,
            }
        )

        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId,
        )

        if (!statusCode) throw Error;

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        return post;
    } catch (error) {
        console.log(error)
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;

    try {
        //to check if there is already an image
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId,
        }
        // we can then figure out if the user has a file to update
        if (hasFileToUpdate) {
            // if yes, we upload image to storage
            const uploadedFile = await uploadFile(post.file[0]);
            if (!uploadedFile) throw Error;

            //  Get file url
            const fileUrl = getFilePreview(uploadedFile.$id);

            if (!fileUrl) {
                await deleteFile(uploadedFile.$id)
                throw Error;
            }
            // we update the image and corresponding file
            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }

        }

        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId, //not unique id because the post already exists
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags,
            }
        )

        if (!updatedPost) {
            await deleteFile(post.imageId)
            throw Error;
        }
        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function deletePost(postId: string, imageId: string) {
    if (!postId || !imageId) throw Error;

    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(9)]

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error)
    }
}

export async function searchPosts(searchTerm: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error)
    }
}

// ============================== GET USER'S POST
export async function getUserPosts(userId?: string) {
    if (!userId) return;

    try {
        const post = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
        );

        if (!post) throw Error;

        return post;
    } catch (error) {
        console.log(error);
    }
}

// USER
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
    const queries: any[] = [Query.orderDesc("$createdAt")];

    if (limit) {
        queries.push(Query.limit(limit));
    }

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries,
        );

        if (!users) throw Error;

        return users;
    } catch (error) {
        console.log(error);
    }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        );

        if (!user) throw Error;

        return user;
    } catch (error) {
        console.log(error);
    }
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;
    try {
        let image = {
            imageUrl: user.imageUrl,
            imageId: user.imageId,
        };

        if (hasFileToUpdate) {
            // Upload new file to appwrite storage
            const uploadedFile = await uploadFile(user.file[0]);
            if (!uploadedFile) throw Error;

            // Get new file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }

        //  Update user
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                bio: user.bio,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
            }
        );

        // Failed to update
        if (!updatedUser) {
            // Delete new file that has been recently uploaded
            if (hasFileToUpdate) {
                await deleteFile(image.imageId);
            }
            // If no new file uploaded, just throw error
            throw Error;
        }

        // Safely delete old file after successful update
        if (user.imageId && hasFileToUpdate) {
            await deleteFile(user.imageId);
        }

        return updatedUser;
    } catch (error) {
        console.log(error);
    }
}

// ============================== COMMENTS
// function to create Comment 
export async function createComment(comment: INewComment) {
    try {
        //upload image to storage

        //save post to database
        const newComment = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: comment.userId,
                TextComment: comment.TextComment,
            }
        )

        if (!newComment) {
            throw Error;
        }
        return newComment;
    } catch (error) {
        console.log(error);
    }
}

// get comment by Id
export async function getCommentById(commentId: string) {
    try {
        const comment = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            commentId
        )

        return comment;
    } catch (error) {
        console.log(error)
    }
}


// update comment 
export async function updateComment(comment: IUpdateComment) {

    try {
        
        const updatedComment = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            comment.commentId, //not unique id because the post already exists
            {
                TextComment: comment.TextComment,
            }
        )

        if (!updatedComment) {
            throw Error;
        }
        return updatedComment;
    } catch (error) {
        console.log(error);
    }
}

// delete comment
export async function deleteComment(commentId: string) {
    if (!commentId) throw Error;

    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            commentId
        )

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    }
}

// get infinite comments
export async function getInfiniteComments({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(9)]

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }
    try {
        const comments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            queries
        )

        if (!comments) throw Error;

        return comments;
    } catch (error) {
        console.log(error)
    }
}

export async function searchComments(searchTerm: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error)
    }
}

// ============================== GET USER'S COMMENTS
export async function getUserComments(userId?: string) {
    if (!userId) return;

    try {
        const comment = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
        );

        if (!comment) throw Error;

        return comment;
    } catch (error) {
        console.log(error);
    }
}