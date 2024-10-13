import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Props = {
    username: string | null;
}

const LoadingSubmitModal = ({ username }: Props) => {
    return (
        <Dialog open={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submitting Code</DialogTitle>
                    <DialogDescription>
                        {username ? `${username} is submitting their code...` : 'Code is being submitted...'}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LoadingSubmitModal