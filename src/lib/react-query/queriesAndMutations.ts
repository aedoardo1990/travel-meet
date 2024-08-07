import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import {
    createUserAccount,
    signInAccount,
    getCurrentUser,
    signOutAccount,
    getUsers,
    createPost,
    getPostById,
    updatePost,
    getUserPosts,
    deletePost,
    likePost,
    getUserById,
    updateUser,
    getRecentPosts,
    getInfinitePosts,
    searchPosts,
    savePost,
    deleteSavedPost,
    createComment,
    getCommentById,
    updateComment,
    deleteComment,
    getInfiniteComments,
    searchComments,
    getUserComments
  } from "@/lib/appwrite/api";
import { INewPost, INewUser, IUpdatePost, IUpdateUser, INewComment, IUpdateComment } from '@/types'
import { QUERY_KEYS } from './queryKeys';

//to create the user
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    });
}

//to sign in into the account
export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string;
            password: string;
        }) => signInAccount(user)
    });
}

//to sign out the account
export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    });
}

//to create a Post
export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            //to allow fetch all new created posts on same page
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

// to get all recent posts
export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts
    })
}

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[] }) => likePost(postId, likesArray),
        onSuccess: (data) => { // to see the updated likes count in different situation just after post was liked
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId: string }) => savePost(postId, userId),
        onSuccess: () => { // the next are to be updated on success
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
        onSuccess: () => { // the next are to be updated on success
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

export const useGetUsers = (limit?: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: () => getUsers(limit),
    });
};

export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId,
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: IUpdateUser) => updateUser(user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
            });
        },
    });
};

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}

export const useGetUserPosts = (userId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
        queryFn: () => getUserPosts(userId),
        enabled: !!userId,
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
            deletePost(postId || "", imageId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts as any,
        getNextPageParam: (lastPage: any) => {
            if (lastPage && lastPage.documents.length === 0) {
                return null;
            }
            const lastId = lastPage.documents[lastPage?.documents.length - 1].$id;
            return lastId;
        },
        initialPageParam: null,
    });
};

export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm
    })
}

//to create a Comment
export const useCreateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (comment: INewComment) => createComment(comment),
        onSuccess: () => {
            //to allow fetch all new created posts on same page
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_COMMENTS]
            })
        }
    })
}

// to get all recent comments
export const useGetRecentComments = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_COMMENTS],
        // LINE SHOULD BE ADDED? POSSIBLE BUG
    })
}

export const useGetCommentById = (commentId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COMMENT_BY_ID, commentId],
        queryFn: () => getCommentById(commentId),
        enabled: !!commentId
    })
}

export const useGetUserComments = (userId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_COMMENTS, userId],
        queryFn: () => getUserComments(userId),
        enabled: !!userId,
    });
};

export const useUpdateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (comment: IUpdateComment) => updateComment(comment),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_COMMENT_BY_ID, data?.$id]
            })
        }
    })
}

export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId }: { commentId?: string }) =>
            deleteComment(commentId || ""),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_COMMENTS]
            })
        }
    })
}

export const useGetComments = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_COMMENTS],
        queryFn: getInfiniteComments as any,
        getNextPageParam: (lastPage: any) => {
            if (lastPage && lastPage.documents.length === 0) {
                return null;
            }
            const lastId = lastPage.documents[lastPage?.documents.length - 1].$id;
            return lastId;
        },
        initialPageParam: null,
    });
};

export const useSearchComments = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_COMMENTS, searchTerm],
        queryFn: () => searchComments(searchTerm),
        enabled: !!searchTerm
    })
}
