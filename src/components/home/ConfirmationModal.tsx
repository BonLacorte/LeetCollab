import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const ConfirmationModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className='bg-gray-100 rounded-2xl shadow-xl'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create a Room?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Answering a problem will create a room. Do you want to continue?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {/* <Input
                    placeholder="Enter room password"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    type="password"
                /> */}
                <AlertDialogFooter>
                    <AlertDialogCancel className='border border-gray-300 hover:border-gray-500 rounded-2xl px-4 py-2' onClick={onClose}>No</AlertDialogCancel>
                    <AlertDialogAction className='border border-gray-300 hover:border-gray-500 rounded-2xl px-4 py-2' onClick={onConfirm}>Yes</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmationModal;