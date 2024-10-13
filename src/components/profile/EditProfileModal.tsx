import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CldUploadWidget } from 'next-cloudinary';
import { Plus } from 'lucide-react';
import { useGetUserProfileQuery } from '@/app/state/api';
import ImageUpload from '../ImageUpload';
import user from '@/lib/problems/images/user.png'

type EditProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
    userProfile: {
        userId: string;
        name: string;
        username: string;
        email: string;
        image: string;
    };
    onSave: (updatedProfile: any) => void;
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, userProfile, onSave }) => {
    
    // const 
    // console.log("Edit Profile Modal", userProfile);

    const [name, setName] = useState(userProfile.name);
    const [username, setUsername] = useState(userProfile.username);
    const [email, setEmail] = useState(userProfile.email);

    useEffect(() => {
        setName(userProfile.name);
        setUsername(userProfile.username);
        setEmail(userProfile.email);
    }, [userProfile]);

    // const { data: fetchedUserProfile, isLoading } = useGetUserProfileQuery(userProfile.userId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, username, email });
        onClose();
    };

    return (
            
            <Dialog  open={isOpen} onOpenChange={onClose}>
                <DialogContent className='bg-gray-100'>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" className='border-gray-300' required defaultValue={userProfile.name} value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" className='border-gray-300' required defaultValue={userProfile?.username} value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" className='border-gray-300' type="email" required defaultValue={userProfile?.email} value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        )

};

export default EditProfileModal;