import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CommentValidation } from "@/lib/validation"
import { Models } from 'appwrite'
import { Textarea } from "@/components/ui/textarea"
import { useCreateComment, useUpdateComment } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"

type CommentFormProps = {
    comment?: Models.Document;
    action: 'Create' | 'Update';
}

const CommentForm = ({ comment, action }: CommentFormProps) => {
    const { mutateAsync: createComment, isPending: isLoadingCreate } = useCreateComment();
    const { mutateAsync: updateComment, isPending: isLoadingUpdate } = useUpdateComment();

    const { user } = useUserContext();
    const { toast } = useToast();
    const navigate = useNavigate();

    // 1. Define your form.
    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            TextComment: comment ? comment?.TextComment : "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof CommentValidation>) {
        if (comment && action === 'Update') {
            const updatedComment= await updateComment({
                ...values,
                commentId: comment.$id,

            })

            if(!updatedComment) {
                toast({ title: 'Please try again' })
            }  
            return navigate(`/comments/${comment.$id}`)
        }

        const newComment = await createComment({
            ...values,
            userId: user.id,
        })

        if (!newComment) {
            toast({
                title: 'Please try again'
            })
        }
        navigate('/');
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="TextComment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Caption</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="shad-textarea custom-scrollbar"
                                    placeholder="Add a description"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                
                <div className="flex gap-4 items-center justify-end">
                    <Button
                        type="button"
                        className="shad-button_secondary"
                    >Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="shad-button_primary whitespace-nowrap"
                        disabled={isLoadingCreate || isLoadingUpdate}
                    >
                        {isLoadingCreate || isLoadingUpdate && 'Loading...'}
                        {action} Comment
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CommentForm